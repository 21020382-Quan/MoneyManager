"use client"

import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react"

export default function ElectricalPrice() {
  const [priceTable, setPriceTable] = useState<string[]>();
  const [error, setError] = useState<boolean>(false);
  const { user } = useUser();
  const { toast } = useToast();
  const fetchData = async () => {
    try {
      if (!user) throw new Error("User is not logged in!");
      const response = await fetch(`http://localhost:8081/api/v1/transaction/scrape-evn/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Get transactions error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.image_urls);
      setPriceTable(data.image_urls);
    } catch (error) {
      toast({
        title: `Failed to load page!`,
        description: `${error}`,
        duration: 3000,
        className: "border-none bg-red-500 text-white",
      });
      setError(true);
    }
  }
  useEffect(() => {
    if (user) fetchData();  
  }, [user])

  if (error || priceTable === undefined) {
    return <div></div>
  }

  return (
    <div>
      <h1 className="font-bold text-3xl mb-8">Electrical price</h1>
      <div className="flex flex-col items-center gap-4">
        <img src={priceTable[1]} alt="price" width="50%" />
        <img src={priceTable[2]} alt="price" width="50%" />
        <img src={priceTable[3]} alt="price" width="50%" />
        <img src={priceTable[4]} alt="price" width="50%" />
      </div>
    </div>
  ) 
}