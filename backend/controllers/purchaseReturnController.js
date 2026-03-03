const mongoose = require('mongoose');
const PurchaseReturn = require('../models/PurchaseReturn');
const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');
const Counter = require('../models/Counter');

const buildPagination = (total, page, limit) => {
  const pages = Math.max(1, Math.ceil(total / limit));
  return { total, page, limit, pages };
};

exports.getAllPurchaseReturns = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const { from, to } = req.query;

  const filter = {};

  if (from || to) {
    filter.date = {};
    if (from) {
      filter.date.$gte = new Date(from);
    }
    if (to) {
      filter.date.$lte = new Date(to);
    }
  }

  const total = await PurchaseReturn.countDocuments(filter);

  const returns = await PurchaseReturn.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return res.json({
    success: true,
    data: {
      returns,
      pagination: buildPagination(total, page, limit),
    },
  });
};

exports.getPurchaseReturnById = async (req, res) => {
  const { id } = req.params;

  const purchaseReturn = await PurchaseReturn.findById(id);

  if (!purchaseReturn) {
    return res
      .status(404)
      .json({ success: false, message: 'Purchase return not found' });
  }

  return res.json({
    success: true,
    data: { return: purchaseReturn },
  });
};

exports.createPurchaseReturn = async (req, res) => {
  const {
    lines,
    date,
  } = req.body;

  if (!Array.isArray(lines) || lines.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Return lines are required',
    });
  }

  const session = await mongoose.startSession();
  let useTransaction = true;

  try {
    session.startTransaction();
  } catch (err) {
    // MongoDB not running as replica set, proceed without transaction
    useTransaction = false;
  }

  try {
    const returnLines = [];
    const movementIds = [];

    const return_number = await Counter.nextVal('purchase_returns', useTransaction ? session : undefined);

    for (const line of lines) {
      const { product_id, qty } = line;
      const quantity = Number(qty);

      if (!Number.isFinite(quantity) || quantity <= 0) {
        if (useTransaction) {
          await session.abortTransaction();
        }
        session.endSession();
        return res.status(400).json({
          success: false,
          message: 'Quantity must be a positive number',
        });
      }

      const productQuery = Product.findOne({
        _id: product_id,
        is_deleted: false,
      });
      if (useTransaction) productQuery.session(session);
      const product = await productQuery;

      if (!product) {
        if (useTransaction) {
          await session.abortTransaction();
        }
        session.endSession();
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      product.on_hand = (product.on_hand || 0) - quantity;
      if (product.on_hand < 0) {
        if (useTransaction) {
          await session.abortTransaction();
        }
        session.endSession();
        return res.status(409).json({
          success: false,
          message: `Insufficient stock for return: ${product.name}`,
        });
      }

      await product.save({ session: useTransaction ? session : undefined });

      const movement_id = await Counter.nextVal('movements', useTransaction ? session : undefined);

      await InventoryTransaction.create(
        [
          {
            movement_id,
            product_id: product._id,
            product_code: product.product_code,
            product_name: product.name,
            qty: -quantity,
            type: 'purchase_return',
            source: {
              doc_type: 'purchase_return',
              doc_number: return_number,
            },
            createdBy: req.user ? req.user._id : undefined,
          },
        ],
        useTransaction ? { session } : {}
      );

      returnLines.push({
        product_id: product._id,
        product_code: product.product_code,
        product_name: product.name,
        qty: quantity,
      });
    }

    const purchaseReturnDoc = await PurchaseReturn.create(
      [
        {
          return_number,
          date: date ? new Date(date) : new Date(),
          lines: returnLines,
          inventory_movements: movementIds,
          createdBy: req.user ? req.user.id : undefined,
        },
      ],
      useTransaction ? { session } : {}
    );

    if (useTransaction) {
      await session.commitTransaction();
    }

    const created = purchaseReturnDoc[0].toObject();

    return res.status(201).json({
      success: true,
      data: { return: created },
    });
  } catch (error) {
    if (useTransaction) {
      await session.abortTransaction();
    }
    console.error('Error creating purchase return:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create purchase return',
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
