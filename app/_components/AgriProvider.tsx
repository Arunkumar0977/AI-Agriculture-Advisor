"use client";

import React, { useState, useContext, useEffect } from "react";
import Header from "./Header";
import { AdvisoryDetailContext } from "@/context/AdvisoryDetailContext";
import { AdvisoryInfo } from "@/app/create-agri-advisor/_components/AgriChatBox";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { AdvisoryContextType } from "@/context/AdvisoryDetailContext";

// ✅ Define proper type (instead of any)
type UserDetailType = {
  _id?: string;
  email: string;
  name: string;
  imageUrl: string;
};

const AgriProvider = ({ children }: { children: React.ReactNode }) => {
  const CreateUser = useMutation(api.user.CreateNewUser);

  // ✅ FIXED (removed any)
  const [userDetail, setUserDetail] = useState<UserDetailType | null>(null);

  const [advisoryInfo, setAdvisoryInfo] = useState<AdvisoryInfo | null>(null);

  const { user } = useUser();

  useEffect(() => {
    const create = async () => {
      if (user) {
        try {
          const res = await CreateUser({
            email: user.primaryEmailAddress?.emailAddress ?? "",
            name: user.fullName ?? "",
            imageUrl: user.imageUrl ?? "",
          });

          setUserDetail(res);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error("Create user error:", err.message);
          } else {
            console.error("Create user error:", err);
          }
        }
      }
    };

    create();
  }, [user, CreateUser]); // ✅ FIXED dependency

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <AdvisoryDetailContext.Provider value={{ advisoryInfo, setAdvisoryInfo }}>
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
          <Header />
          {children}
        </div>
      </AdvisoryDetailContext.Provider>
    </UserDetailContext.Provider>
  );
};

export default AgriProvider;

// ✅ Hook for user detail
export const useUserDetail = () => {
  return useContext(UserDetailContext);
};

// ✅ Hook for advisory detail
export const useAdvisoryDetail = (): AdvisoryContextType => {
  const context = useContext(AdvisoryDetailContext);

  if (!context) {
    throw new Error("❌ useAdvisoryDetail must be used within an <AgriProvider>.");
  }

  return context;
};