const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const port = 3030;

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const jsonParser = bodyParser.json()

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.post('/owner', jsonParser, async (req, res) => {
    const body = req.body
    try {
        const newOwner = await prisma.owner.create({
            data: {
                name: body.name,
                age: body.age,
                Car: {
                    create: {
                        make: body.car.make,
                        model: body.car.model,
                        year: body.car.year
                    }
                }
            }
        });
        res.status(200).json({owner: newOwner})
    } catch (e) {
        console.log(e);
        res.status(503).json({error: "Failed to create Owner and Car."});
    }
});

app.get("/car/:carId", async (req, res) => {
    try {
      const car = await prisma.car.findFirst({
          where: {
              id: Number(req.params.carId)
          },
          include: {
              owner: true
          }
      })
      res.status(200).json({ car });
    } catch (e) {
      console.log(e);
      res.status(503).json({ error: "Failed to get car." });
    }
  });
