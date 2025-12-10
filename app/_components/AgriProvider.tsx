
"use client";

import React, { useState } from "react";
import Header from "./Header";
import { AdvisoryDetailContext } from "@/context/AdvisoryDetailContext";
import { AdvisoryInfo } from "@/app/create-agri-advisor/_components/AgriChatBox";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useContext } from "react";
import { AdvisoryContextType } from "@/context/AdvisoryDetailContext";

const AgriProvider = ({ children }: { children: React.ReactNode }) => {
  const CreateUser = useMutation(api.user.CreateNewUser);
  const [userDetail, setUserDetail] = useState<any>(null);
  const [advisoryInfo, setAdvisoryInfo] = useState<AdvisoryInfo | null>(null);

  const { user } = useUser();

  React.useEffect(() => {
    const create = async () => {
      if (user) {
        try {
          const res = await CreateUser({
            email: user.primaryEmailAddress?.emailAddress ?? "",
            name: user.fullName ?? "",
            imageUrl: user.imageUrl ?? "",
          });
          setUserDetail(res);
        } catch (err) {
          console.error("Create user error:", err);
        }
      }
    };
    create();
  }, [user]);

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
export const useUserDetail = () => {
  return useContext(UserDetailContext);
};

export const useAdvisoryDetail = (): AdvisoryContextType => {
  const context = useContext(AdvisoryDetailContext);

  if (!context) {
    throw new Error("❌ useAdvisoryDetail must be used within an <AgriProvider>.");
  }

  return context;
};