"use client";

import React from 'react';
import GoogleTranslateWidget from "@/components/GoogleTranslate";

const CustomerFooter = () => {
    return (
      <footer className="bg-[#800000] text-white p-8 flex flex-col justify-between">
        <div className="flex flex-row justify-between flex-wrap">
          <div className="flex flex-col p-2 min-w-[150px]"aria-hidden="true">
          </div>
          <div className="flex flex-col p-2 min-w-[150px] items-center text-lg">
            <h1 className="mb-4 font-bold">Located in: Memorial Student Center (MSC)</h1>
            <p>275 Joe Routt Blvd, College Station, TX 77840</p>
          </div>
          <GoogleTranslateWidget />
        </div>
        <div className="text-right text-sm mt-4" role="contentinfo" aria-label="Copyright information">
          © 2024 Luka Doncic Goat Team
        </div>
      </footer>
    );
  };

export default CustomerFooter;
