const express = require("express");
const app = express();
const http = require("http");
const { disconnect } = require("process");
const server = http.createServer(app);
const io = new require("socket.io")(server);
server.listen(8888, () => {console.log("Le serveur écoute sur le port 8888");});


app.get("/", (request, response) => {
    response.sendFile("client_socket.io2.html", {root: __dirname});
});

var ListeJoueurs = []
var joueurs = {j1 : null, j2 : null}
const listeJoueursParSocketID = new Map()


io.on("connection", (socket) => {

    console.log(`Nouvelle connexion SocketID : ${socket.id}`);
    // Affiche les infos dès la connexion
    io.emit("liste" , ListeJoueurs)
    io.emit("nbJoueurs" , ListeJoueurs.length)
    io.emit("JoueursParSocketID", listeJoueursParSocketID)

    // Entrée d'un joueur
    socket.on ("entree" , nomJoueur => {

        // Verifications avant d'ajouter le joueur dans la liste
        if (!ListeJoueurs.includes(nomJoueur) && ListeJoueurs.length < 2){

            ListeJoueurs.push (nomJoueur)
            listeJoueursParSocketID.set(socket.id, nomJoueur)

            console.log(ListeJoueurs)   
            console.log(joueurs)     
        
            io.emit("liste" , ListeJoueurs)
            io.emit("nbJoueurs" , ListeJoueurs.length)
            io.emit("JoueursParSocketID", listeJoueursParSocketID)
            socket.emit("VotreNom", nomJoueur)
            
    
        }
        else { 
            socket.emit("VotreNom", "Nom déjà pris ou partie pleine.");
        }
       
    })


    socket.on("sortie", nomJoueur => {
        console.log("sortie d'un joueur : ")
        console.log(nomJoueur)

        var index = 0
        
        listeJoueursParSocketID.delete(socket.id)

        for(let i = 0; i <= ListeJoueurs.length; i++){
            if (ListeJoueurs[i] == nomJoueur){
                ListeJoueurs.splice(index, 1)
                console.log("Nouvelle liste joueurs : " + ListeJoueurs) 
            }
            index++
        }

        io.emit("liste" , ListeJoueurs)
        io.emit("nbJoueurs" , ListeJoueurs.length)
        io.emit("JoueursParSocketID", listeJoueursParSocketID)
        socket.emit("VotreNom", "Pas indiqué")
        
        

    })

    socket.on("disconnect",() =>{
        
        console.log(socket.id)
        console.log("sortie d'un joueur : ")
        console.log(nomJoueur)
    
        listeJoueursParSocketID.delete(socket.id)

        var index = 0
        
        for(let i = 0; i <= ListeJoueurs.length; i++){
            if (ListeJoueurs[i] == nomJoueur){
                ListeJoueurs.splice(index, 1)
                console.log("Nouvelle liste joueurs : " + ListeJoueurs) 
            }
            index++
        }
    

        io.emit("liste" , ListeJoueurs)
        io.emit("nbJoueurs" , ListeJoueurs.length)
        io.emit("JoueursParSocketID", listeJoueursParSocketID)
        socket.emit("VotreNom", nomJoueur)
        
    })
    
})




