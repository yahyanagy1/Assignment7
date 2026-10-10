export const successRes = ({ res, status = 200, message, data = {} }) => {
    res.status(status).json({ message, ...data })
}

// ---------------------------------------------------------------
// WHAT WE DID ABOVE 
//
// - We send the answer as JSON.
// - { message, ...data } puts the message first, then the data.
//   This is the same shape as the assignment pictures.
// ---------------------------------------------------------------