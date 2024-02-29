import express from "express";
import { conn,queryAsync } from "../dbconnect"
import { TripPostRequest } from "../model/trip_post_req";
import mysql from "mysql";

// create router of this API
export const router = express.Router();

// Get trip by id or name
// http://{{server}}:{{port}}/trip/search/fields?id=2
router.get("/search/fields",(req, res)=>{
    if(req.query){
        const id = req.query.id;
        const name = req.query.name;
        const sql = "select * from trip where " +
        " (idx IS NULL OR idx = ?) OR (name IS NULL OR name like ?)";
        conn.query(sql, [id, "%"+name+"%"], (err, result)=>{
            res.json(result);
        });
    }else{
        res.send("Send something");
    }
});

//  router.get("/",(req, res)=>{
//     const sql = "select * from trip";
//     conn.query(sql, (err, result)=>{
//         res.status(200);
//         res.json(result);
//     });
//     if(req.query){
//         const id = req.query.id;
//         const name = req.query.name;
//         res.send(`Method GET in trip.ts with ${id} ${name}`);
//     }else{
//         res.send("Method GET in index.ts");
//     }
// });

router.post("/",(req, res)=>{
    const trip: TripPostRequest = req.body;
    console.log(trip);
    let sql =
    "INSERT INTO `trip`(`name`, `country`, `destinationid`, `coverimage`, `detail`, `price`, `duration`) VALUES (?,?,?,?,?,?,?)";
    sql = mysql.format(sql, [
        trip.name,
        trip.country,
        trip.destinationid,
        trip.coverimage,
        trip.detail,
        trip.price,
        trip.duration
    ])
    conn.query(sql,(err,result)=>{
        if(err) throw err;
        res.status(201).json({
            affected_row : result.affectedRows,
            last_idx : result.insertId
        });
    })
    res.status(201).send("OK");
 });

 // Query trip by id => firld idx
 router.get("/:id",(req, res)=>{
    const id = req.params.id;
    // Bad
    // const sql = "select * from trip where idx = " + id;

    // Good
    const sql = "select * from users where uid = ?";
    // const sql = "select * from trip where idx = ?";
    conn.query(sql,[id] , (err, result)=>{
        res.json(result);
    });
 });

 //http://{{server}}:{{port}}/trip/price/20000
 router.get("/price/:price",(req, res)=>{
    const price = req.params.price;
    const sql = "select * from trip where price <= ?";
    conn.query(sql,[price],(err, result)=>{
        res.json(result);
    });
 })

 // DELETE /trip/1
 router.delete("/:id", (req, res)=>{
    const id = +req.params.id;
    let sql = 'Delete from trip where idx = ?';
    conn.query(sql, [id], (err, result)=>{
        if(err) throw err;
        res.status(200).json({ 
            affected_row: result.affectedRows })
    });
 });

//  router.put("/:id", (req, res)=>{
//     const id = +req.params.id;
//     const trip: TripPostRequest = req.body;
//     let sql = "update  `trip` set `name`=?, `country`=?, `destinationid`=?, `coverimage`=?, `detail`=?, `price`=?, `duration`=? where `idx`=?";
//     sql = mysql.format(sql, [
//         trip.name,
//         trip.country,
//         trip.destinationid,
//         trip.coverimage,
//         trip.detail,
//         trip.price,
//         trip.duration,
//         id
//     ]);
//     conn.query(sql, (err,result)=>{
//         if(err) throw err;
//         res.status(200).json({
//             affected_row: result.affectedRows
//         })
//     });
//  });

router.put("/:id", async (req , res)=>{
    const id = +req.params.id;
    let trip : TripPostRequest = req.body;


    //Query original data by id
    let tripOriginal : TripPostRequest | undefined;
    let sql = mysql.format("select * from trip where idx = ?",[id]);
    let result = await queryAsync(sql);
    const jsonstr = JSON.stringify(result)
    const jsonObj = JSON.parse(jsonstr);
    const rawData = jsonObj;
    tripOriginal = rawData[0]

    //Merge recieved object to original
    const updateTrip = {...tripOriginal, ...trip}
    console.log(updateTrip);
    

    sql = "update  `trip` set `name`=?, `country`=?, `destinationid`=?, `coverimage`=?, `detail`=?, `price`=?, `duration`=? where `idx`=?";
    sql = mysql.format(sql, [
        updateTrip.name,
        updateTrip.country,
        updateTrip.destinationid,
        updateTrip.coverimage,
        updateTrip.detail,
        updateTrip.price,
        updateTrip.duration,
        id
    ]);
    conn.query(sql, (err,result)=>{
        if(err) throw err;
        res.status(200).json({
            affected_row: result.affectedRows
        })
    });
})