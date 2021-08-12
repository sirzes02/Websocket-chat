import express from "express";
import http from "http";
import { Server as WebSocketServer } from "socket.io";
import { v4 as uuid } from "uuid";

let notes = [];

const app = express();
const server = http.createServer(app);
const io = new WebSocketServer(server);

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  socket.emit("server:loadnotes", notes);

  socket.on("client:newnote", (newNote) => {
    const note = { ...newNote, id: uuid() };

    notes.push(note);

    io.emit("server:newnote", note);
  });

  socket.on("client:deletenote", (id) => {
    notes = notes.filter((note) => note.id !== id);

    io.emit("server:loadnotes", notes);
  });

  socket.on("client:getnote", (id) => {
    const note = notes.find((note) => note.id === id);

    socket.emit("server:selectednote", note);
  });

  socket.on("client:updatenote", ({ id, title, description }) => {
    notes.map((note) => {
      if (note.id === id) {
        note.title = title;
        note.description = description;
      }

      return note;
    });

    io.emit("server:loadnotes", notes);
  });
});

server.listen(3000);

console.log("server on port", 3000);
