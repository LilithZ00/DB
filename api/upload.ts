import express from "express";
import path from "path";
import multer from "multer";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL,uploadBytesResumable }  from "firebase/storage"

// create router of this API
export const router = express.Router();

// /upload
router.get("/", (req, res) => {
    res.send("Method GET in upload.ts");
});

// class FileMiddleware {
//     filename = "";
//     // create malter object to save file in disk
//     public readonly diskLoader = multer({
//         // diskStorage = save to be saved
//         storage: multer.diskStorage({
//             // destination = folder to be saved
//             // folder upload in this project
//             destination: (_req, _file, cb) => {
//                 cb(null, path.join(__dirname, "../uploads"));
//             },
//             // define file name to de saved
//             filename: (req, file, cb) => {
//                 // unique file + data + random number
//                 const uniqueSuffix =
//                     Date.now() + "-" + Math.round(Math.random() * 10000);
//                 this.filename = uniqueSuffix + "." + file.originalname.split(".").pop();
//                 cb(null, this.filename);
//             },
//         }),

//         limits: {
//             fileSize: 67108864, // 64 MByte
//         },
//     });
// }

// const fileUpload = new FileMiddleware();

// router.post("/", fileUpload.diskLoader.single("file"), (req, res)=>{
//     res.status(200).json(
//         {
//             filename : "/uploads/" + fileUpload.filename
//         }
//     );
// });

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCiNm01k5RMCUw_pF22partMPyQBAfpZMQ",
    authDomain: "bookingtrip-t.firebaseapp.com",
    projectId: "bookingtrip-t",
    storageBucket: "bookingtrip-t.appspot.com",
    messagingSenderId: "798062923235",
    appId: "1:798062923235:web:6fc64e685c80e0fa7724d6",
    measurementId: "G-CRBP9B4DHC"
  };

  initializeApp(firebaseConfig);
  const storage = getStorage();

class FileMiddleware {
    filename = "";
    // create malter object to save file in disk
    public readonly diskLoader = multer({
        // diskStorage = save to be saved
        storage: multer.memoryStorage(),

        limits: {
            fileSize: 67108864, // 64 MByte
        },
    });
}

const fileUpload = new FileMiddleware();

router.post("/", fileUpload.diskLoader.single("file"), async (req, res)=>{
    const filename = Math.round(Math.random() * 10000)+ ".png";
    const storageRef = ref(storage, "images/" + filename );
    const metdata = {
        contentType : req.file!.mimetype
    }
    // upload to storage
    const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metdata);
    const downloadUrl = await getDownloadURL(snapshot.ref); 
    res.status(200).json(
        {
            filename : downloadUrl
        }
    );
});