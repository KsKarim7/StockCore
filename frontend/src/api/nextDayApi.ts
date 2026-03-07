import axiosClient from "@/api/axiosClient";

export interface NextDayModeState {
  next_day_mode: boolean;
  next_day_mode_activated_at: string | null;
}

export const getNextDayMode = async (): Promise<NextDayModeState> => {
  const response = await axiosClient.get("/settings/next-day-mode");

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to fetch next day mode state");
  }

  return {
    next_day_mode: !!response.data.data.next_day_mode,
    next_day_mode_activated_at: response.data.data.next_day_mode_activated_at ?? null,
  };
};

export const setNextDayMode = async (enabled: boolean): Promise<NextDayModeState> => {
  const response = await axiosClient.post("/settings/next-day-mode", {
    next_day_mode: enabled,
  });

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to update next day mode state");
  }

  return {
    next_day_mode: !!response.data.data.next_day_mode,
    next_day_mode_activated_at: response.data.data.next_day_mode_activated_at ?? null,
  };
};

