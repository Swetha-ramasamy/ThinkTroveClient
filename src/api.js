import axios from "axios";
import { backendUrl } from "./BackEndURL";
//require('dotenv').config();
const apiClient=axios.create(
  {
      baseURL:process.env.REACT_APP_URI
  }
)
const handleApiError = (error) => {
  const status = error.response ? error.response.status : 'No status';
  const message = error.response && error.response.data ? error.response.data.message : 'An error occurred.';
  console.error('API Error:', { status, message });
  throw new Error(message);
};
export const signUp = async (obj) => {

    let response = await axios.post(`${backendUrl}/signup`, obj);
    return response;
  
};

export const signIn = async (obj) => {
  try {
    let response = await axios.post(`${backendUrl}/`, obj);
    return response.data;
  } catch (error) {
    console.error('API Error:', {
      status: error.response ? error.response.status : 'No status',
      data: error.response ? error.response.data : 'No data',
    });

    // throw {
    //   status: error.response ? error.response.status : 'No status',
    //   message: error.response && error.response.data ? error.response.data.message : 'An error occurred during sign in.',
    // };
    handleApiError(error)
  }
};

export const addDeck = async (obj) => {
  try{
    let response=await apiClient.post(`${backendUrl}/addDeck`,obj);
    return response.data;
}
catch(error)
{
    console.error(error);
}
}

export const fetchDecks = async (userId) => {
  try {
    let response = await apiClient.get(`${backendUrl}/decks`, { params: { userId } }); // Send userId as a query parameter
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


export const fetchUser = async (userId) => {
  try {
    let response = await apiClient.get(`${backendUrl}/user`, { userId }); // Send userId in the request body
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const updateDeck = async (obj) => {
  try {
    let response = await apiClient.patch(`${backendUrl}/updateDeck`, obj);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const deleteDeck = async (obj) => {
  try {
    let response = await apiClient.patch(`${backendUrl}/deleteDeck`, obj);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const addCard = async (obj) => {
  try {
    let response = await apiClient.post(`${backendUrl}/addCard`, obj);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchCards = async (deckId) => {
  try {
    let response = await apiClient.get(`${backendUrl}/cards`, { params: { deckId } }); // Send deckId as a query parameter
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


export const changeRating = async (cardId,value) => {
  try {
    let response = await apiClient.patch(`${backendUrl}/changeRating/${cardId}`, { value });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateCard = async (obj) => {
  try {
    let response = await apiClient.patch(`${backendUrl}/updateCard`, obj);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const deleteCard = async (obj) => {
  try {
    let response = await apiClient.patch(`${backendUrl}/deleteCard`, obj);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const resetPwd = async (obj) => {
 
    let response = await apiClient.patch(`${backendUrl}/reset`, obj);
    return response;
  
}

    