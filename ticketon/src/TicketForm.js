import React, { useState } from 'react';

const TicketForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    });

    const result = await response.text();
    setResponse(result);
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label><br />
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /><br />
        <label htmlFor="description">Description:</label><br />
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea><br /><br />
        <button type="submit" >Submit</button>
      </form>
      {response && (
        <div dangerouslySetInnerHTML={{ __html: response }} />
      )}
    </div>
  );
};

export default TicketForm;
