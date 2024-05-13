import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const movies = await contactsService.listContacts();
    res.status(200).send(movies);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await contactsService.getContactById(id);

    if (!contact) {
      throw HttpError(404);
    }

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await contactsService.removeContact(id);

    if (!contact) {
      throw HttpError(404);
    }

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const newContact = await contactsService.addContact(contact);

    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contactBeforeUpdate = await contactsService.getContactById(id);

    if (!contactBeforeUpdate) {
      throw HttpError(404);
    }

    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }

    const updatedContact = await contactsService.updateContact(id, contact);

    res.status(201).send(updatedContact);
  } catch (error) {
    next(error);
  }
};
