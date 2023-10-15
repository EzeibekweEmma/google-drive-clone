import { storage, app, database } from "@/firebaseConfig";
import { NextApiRequest, NextApiResponse } from "next";

const firestore = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ text: "OK" });
};

export default firestore;
