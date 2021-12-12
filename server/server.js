import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import moment from "moment";

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.send('Serwer z filmami');
});


app.get('/filmy', (req, res) => {
    fs.readFile('./filmy.json', 'utf8', (err, filmyJson) => {
        if (err) {
            console.log("File read failed in GET /filmy: "+ err);
            res.status(500).send('File read failed');
            return;
        }
        console.log("GET: /filmy");
        res.send(filmyJson);
    });
});


app.get('/bilety', (req, res) => {
    fs.readFile('./bilety.json', 'utf8', (err, biletyJson) => {
        if (err) {
            console.log("File read failed in GET /bilety "+ err);
            res.status(500).send('File read failed');
            return;
        }
        console.log("GET: /bilety");
        res.send(biletyJson);
    });
});


app.get('/filmy/:id', (req, res) => {
    fs.readFile('./filmy.json', 'utf8', (err, filmyJson) => {
        if (err) {
            console.log("File read failed in GET /filmy: "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var filmy = JSON.parse(filmyJson);
        var film = filmy.find(film => film.filmId == req.params.id);
        console.log("GET: /filmy");
        res.send(film);
    });
});


app.get('/sale/:id', (req, res) => {
    fs.readFile('./sale.json', 'utf8', (err, saleJson) => {
        if (err) {
            console.log("File read failed in GET /sale: "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var sale = JSON.parse(saleJson);
        var sala = sale.find(sala => sala.nr_sali == req.params.id);
        console.log("GET: /sale");
        res.send(sala);
    });
});


app.get('/seanse/:id', (req, res) => {
    fs.readFile('./seanse.json', 'utf8', (err, seanseJson) => {
        if (err) {
            console.log("File read failed in GET /seanse: "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var seanse = JSON.parse(seanseJson);
        var seans = seanse.find(seans => seans.seansId == req.params.id);
        console.log("GET: /seanse");
        res.send(seans);
    });
});


app.get("/seanse", (req, res) => {
    const day = parseInt(req.query.day)
    const month = parseInt(req.query.month)
    fs.readFile("./seanse.json", "utf8", (err, seanseJson) => {
      if (err) {
        console.log("File read failed in GET /seanse: " + err);
        res.status(500).send("File read failed");
        return;
      }
      console.log("GET: /seanse");
        let returnedData = JSON.parse(seanseJson)
        if(day && month){
            returnedData = returnedData
            .filter((seans) => {
              const rawData = moment(seans.seansdata, "YYYY-MM-DD");
              const x = rawData.month() + 1;
              const y = rawData.date();
              if (x === month && y === day) {
                return true;
              }
              return false;
            });
        }
        
      res.send(JSON.stringify(returnedData));
    });
  });





app.get('/seansee', (req, res) => {
    const day = parseInt(req.query.day)
    const month = parseInt(req.query.month)
    fs.readFile('./seanse.json', 'utf8', (err, seanseJson) => {
        if (err) {
            console.log("File read failed in GET /seanse: "+ err);
            res.status(500).send('File read failed');
            return;
        }
        console.log("GET: /seanse");
        let returnedData = JSON.parse(seanseJson)
        if(day && month){
            returnedData = returnedData
            .filter((seans) => {
              const rawData = moment(seans.seansdata, "YYYY-MM-DD");
              const x = rawData.month() + 1;
              const y = rawData.date();
              if (x === month && y === day) {
                return true;
              }
              return false;
            });
        }
        
      res.send(JSON.stringify(returnedData));
       // res.send(seanseJson);

    });
});




app.delete('/filmy/:id', (req, res) => {
    fs.readFile('./filmy.json', 'utf8', (err, filmyJson) => {
        if (err) {
            console.log("File read failed in DELETE /filmy: "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var filmy = JSON.parse(filmyJson);
        var filmIndex = filmy.findIndex(filmtmp => filmtmp.filmId == req.params.id);
        if (filmIndex != -1) {
            filmy.splice(filmIndex, 1);
            var newList = JSON.stringify(filmy);
            fs.writeFile('./filmy.json', newList, err => {
                if (err) {
                    console.log("Error writing file in DELETE /filmy/" + req.params.id+": "+ err);
                    res.status(500).send('Error writing file filmy.json');
                } else {
                    // res.status(204).send();
                    console.log("Successfully deleted film with id = " + req.params.id);
                }
            });

            fs.readFile('./seanse.json', 'utf8', (err, seanseJson) => {
                if (err) {
                    console.log("File read failed in GET /seanse: "+ err);
                    res.status(500).send('File read failed');
                    return;
                }

                fs.readFile('./bilety.json', 'utf8', (err, biletyJson) => {
                    if (err) {
                        console.log("File read failed in GET /seanse: "+ err);
                        res.status(500).send('File read failed');
                        return;
                    }


                var bilety = JSON.parse(biletyJson);
                var j = bilety.length;
    

                var seanse = JSON.parse(seanseJson);
                var i = seanse.length

                while (i--){
                    if(seanse[i].seansfilm.id == req.params.id){
                        var id_seansuu = seanse[i].seansId;
                        seanse.splice(i, 1);
                        var j = bilety.length;
                        while(j--){

                            console.log(bilety[j].id_seansu)
                            if(bilety[j].id_seansu == id_seansuu){
                                bilety.splice(j, 1);
                            }
                       }
                    }
                }

                var newListBilety = JSON.stringify(bilety);
                var newListSeanse = JSON.stringify(seanse);


                
                fs.writeFile('./bilety.json', newListBilety, err => {
                    if (err) {
                        console.log("Error writing file in DELETE /biletyinseans/" + req.params.id+": "+ err);
                        res.status(500).send('Error writing file bilety.json');
                    } else {
                        // res.status(204).send();
                        console.log("Successfully deleted seanse,bilety in deleted film with id = " + req.params.id);
                    }
                });

                fs.writeFile('./seanse.json', newListSeanse, err => {
                    if (err) {
                        console.log("Error writing file in DELETE /seanseinfilm/" + req.params.id+": "+ err);
                        res.status(500).send('Error writing file seanse.json');
                    } else {
                        res.status(204).send();
                        console.log("Successfully deleted seanse in deleted film with id = " + req.params.id);
                    }
                });


            })
            });
            
        } else {
            console.log("Film by id = " + req.params.id + " does not exists");
            res.status(500).send('Film by id = ' + req.params.id + ' does not exists');
            return;
        }
    });
});


app.post('/filmy', (req, res) => {
    fs.readFile('./filmy.json', 'utf8', (err, filmyJson) => {
        if (err) {
            console.log("File read failed in POST /filmy: "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var filmy = JSON.parse(filmyJson);
        var film = filmy.find(filmtmp => filmtmp.filmId == req.body.filmId);
        if (!film) {
            filmy.push(req.body);
            var newList = JSON.stringify(filmy);
            fs.writeFile('./filmy.json', newList, err => {
                if (err) {
                    console.log("Error writing file in POST /filmy: "+ err);
                    res.status(500).send('Error writing file filmy.json');
                } else {
                    res.status(201).send(req.body);
                    console.log("Successfully wrote file filmy.json and added new film with id = " + req.body.filmId);
                }
            });
        } else {
            console.log("Film by id = " + req.body.filmId + " already exists");
            res.status(500).send('Film by id = ' + req.body.filmId + ' already exists');
            return;
        }
    });
});


app.post('/seans', (req, res) => {
    fs.readFile('./seanse.json', 'utf8', (err, seanseJson) => {
        if (err) {
            console.log("File read failed in POST /seanse: "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var seanse = JSON.parse(seanseJson);
        var seans = seanse.find(seanstmp => seanstmp.seansId == req.body.seansId);
        if (!seans) {
            seanse.push(req.body);
            var newList = JSON.stringify(seanse);
            fs.writeFile('./seanse.json', newList, err => {
                if (err) {
                    console.log("Error writing file in POST /seanse: "+ err);
                    res.status(500).send('Error writing file seanse.json');
                } else {
                    res.status(201).send(req.body);
                    console.log("Successfully wrote file seanse.json and added new seans with id = " + req.body.seansId);
                }
            });
        } else {
            console.log("Seans by id = " + req.body.seansId + " already exists");
            res.status(500).send('Film by id = ' + req.body.seansId + ' already exists');
            return;
        }
    });
});



app.post('/bilety', (req, res) => {
    fs.readFile('./bilety.json', 'utf8', (err, biletyJson) => {
        if (err) {
            console.log("File read failed in POST /bilety: "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var bilety = JSON.parse(biletyJson);
        var bilet = bilety.find(bilettmp => bilettmp.biletId == req.body.biletId);
        if (!bilet) {
            bilety.push(req.body);
            var newList = JSON.stringify(bilety);
            fs.writeFile('./bilety.json', newList, err => {
                if (err) {
                    console.log("Error writing file in POST /bilety: "+ err);
                    res.status(500).send('Error writing file bilety.json');
                } else {
                    res.status(201).send(req.body);
                    console.log("Successfully wrote file bilety.json and added new bilet with id = " + req.body.biletId);
                }
            });
        } else {
            console.log("Bilet by id = " + req.body.biletId + " already exists");
            res.status(500).send('Bilet by id = ' + req.body.biletId + ' already exists');
            return;
        }
    });
});



app.put('/filmy/:id', (req, res) => {
    fs.readFile('./filmy.json', 'utf8', (err, filmyJson) => {
        if (err) {
            console.log("File read failed in PUT /filmy/" + req.params.id+": "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var filmy = JSON.parse(filmyJson);
        var filmBody = filmy.find(filmtmp => filmtmp.filmId == req.body.filmId);
        if (filmBody && filmBody.filmId != req.params.id) {
            console.log("Film by id = " + filmBody.filmId + " already exists");
            res.status(500).send('Film by id = ' + filmBody.filmId + ' already exists');
            return;
        }
        var film = filmy.find(filmtmp => filmtmp.filmId == req.params.id);
        if (!film) {
            filmy.push(req.body);
            var newList = JSON.stringify(filmy);
            fs.writeFile('./filmy.json', newList, err => {
                if (err) {
                    console.log("Error writing file in PUT /filmy/" + req.params.id+": "+err);
                    res.status(500).send('Error writing file filmy.json');
                } else {
                    res.status(201).send(req.body);
                    console.log("Successfully wrote file filmy.json and added new film with id = " + req.body.filmId);
                }
            });
        } else {
            for (var i = 0; i < filmy.length; i++) {
                if (filmy[i].filmId == film.filmId) {
                    filmy[i] = req.body;
                }
            }
            var newList = JSON.stringify(filmy);
            fs.writeFile('./filmy.json', newList, err => {
                if (err) {
                    console.log("Error writing file in PUT /filmy/" + req.params.id+": "+ err);
                    res.status(500).send('Error writing file filmy.json');
                } else {
                    res.status(200).send(req.body);
                    console.log("Successfully wrote file filmy.json and edit film with old id = " + req.params.id);
                }
            });
        }
    });
});



app.put('/seanse/:id', (req, res) => {
    fs.readFile('./seanse.json', 'utf8', (err, seanseJson) => {
        if (err) {
            console.log("File read failed in PUT /seanse/" + req.params.id+": "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var seanse = JSON.parse(seanseJson);
        var seansBody = seanse.find(seanstmp => seanstmp.seansId == req.body.seansId);
        if (seansBody && seansBody.seansId != req.params.id) {
            console.log("Seans by id = " + seansBody.seansId + " already exists");
            res.status(500).send('Seans by id = ' + seansBody.seansId + ' already exists');
            return;
        }
        var seans = seanse.find(seanstmp => seanstmp.seansId == req.params.id);
        if (!seans) {
            seanse.push(req.body);
            var newList = JSON.stringify(seanse);
            fs.writeFile('./seanse.json', newList, err => {
                if (err) {
                    console.log("Error writing file in PUT /seanse/" + req.params.id+": "+err);
                    res.status(500).send('Error writing file seanse.json');
                } else {
                    res.status(201).send(req.body);
                    console.log("Successfully wrote file seanse.json and added new seans with id = " + req.body.seansId);
                }
            });
        } else {
            for (var i = 0; i < seanse.length; i++) {
                if (seanse[i].seansId == seans.seansId) {
                    seanse[i] = req.body;
                }
            }
            var newList = JSON.stringify(seanse);
            fs.writeFile('./seanse.json', newList, err => {
                if (err) {
                    console.log("Error writing file in PUT /seanse/" + req.params.id+": "+ err);
                    res.status(500).send('Error writing file seanse.json');
                } else {
                    res.status(200).send(req.body);
                    console.log("Successfully wrote file seanse.json and edit seans with old id = " + req.params.id);
                }
            });
        }
    });
});



app.listen(7777, () => console.log("Adres serwera: http://localhost:7777"));