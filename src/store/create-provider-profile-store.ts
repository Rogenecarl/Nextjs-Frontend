import { OnboardingCreateProviderProfileType } from "@/components/Provider/features/onboarding/schema";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand/react";

type OnboardingCreateProivderProfileState = Partial<OnboardingCreateProviderProfileType> & {
    setData: (data: Partial<OnboardingCreateProviderProfileType>) => void;
}

export const useOnboardingCreateProviderProfileStore = create<OnboardingCreateProivderProfileState>()(
    persist(
        (set) => ({
            setData: (data) => set((state) => ({ ...state, ...data })),
        }),
        {
            name: "onboarding-create-provider-profile",
            storage: createJSONStorage(() => localStorage),
        }
    )
)