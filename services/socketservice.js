const message = require('../models/message');

const initsocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`client connected to real-time socket: ${socket.id}`);

    // Join a specific event room
    socket.on('join_event', (eventid) => {
      socket.join(eventid);
      console.log(`socket ${socket.id} joined event room: ${eventid}`);
    });

    // Leave a specific event room
    socket.on('leave_event', (eventid) => {
      socket.leave(eventid);
      console.log(`socket ${socket.id} left event room: ${eventid}`);
    });

    // Broadcast live announcement (admin to room)
    socket.on('send_announcement', async (data) => {
      try {
        const { eventid, senderid, content } = data;

        // Save announcement to database
        const newmessage = await message.create({
          event: eventid,
          sender: senderid,
          content,
        });

        const populatedmessage = await newmessage.populate('sender', 'name role');

        // Broadcast ONLY to attendees in the target event room
        io.to(eventid).emit('new_announcement', populatedmessage);
      } catch (error) {
        console.error('error saving socket announcement:', error.message);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`client disconnected from socket: ${socket.id}`);
    });
  });
};

module.exports = initsocket;