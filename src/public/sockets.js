const socket = io();

const saveNote = (title, description) => {
  socket.emit("client:newnote", {
    title,
    description,
  });
};

const deleteNote = (id) => socket.emit("client:deletenote", id);

const getNote = (id) => socket.emit("client:getnote", id);

const updateNote = (id, title, description) =>
  socket.emit("client:updatenote", { id, title, description });

socket.on("server:newnote", appendNote);

socket.on("server:loadnotes", renderNotes);

socket.on("server:selectednote", ({ title, description, id }) => {
  const titleInput = document.querySelector("#title");
  const descriptionInput = document.querySelector("#description");

  titleInput.value = title;
  descriptionInput.value = description;
  savedId = id;
});
