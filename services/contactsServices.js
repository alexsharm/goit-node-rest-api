import contact from "../models/contact.js";
import Contact from "../models/contact.js";

async function listContacts() {
  const contacts = await Contact.find();

  return contacts;
}

async function getContactById(contactId) {
  const contact = Contact.findById(contactId);

  if (typeof contact === "undefined") {
    return null;
  }

  return contact;
}

async function removeContact(contactId) {
  const removedContact = await Contact.findByIdAndDelete(contactId);

  if (removedContact === undefined) {
    return null;
  }

  return removedContact;
}

async function addContact(newContact) {
  const result = Contact.create(newContact);

  return result;
}

async function updateContact(contactId, { name, email, phone, favorite }) {
  const contactToUpdate = await Contact.findById(contactId);

  let newName;
  let newEmail;
  let newPhone;

  name ? (newName = name) : (newName = contactToUpdate.name);
  email ? (newEmail = email) : (newEmail = contactToUpdate.email);
  phone ? (newPhone = phone) : (newPhone = contactToUpdate.phone);

  const updateBody = {
    name: newName,
    email: newEmail,
    phone: newPhone,
  };

  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    updateBody,
    { new: true }
  );

  if (!updatedContact) {
    return null;
  }

  return updatedContact;
}

async function updateStatusContact(contactId, favorite) {
  const contactToUpdate = await Contact.findById(contactId);

  const updateBody = {
    name: contactToUpdate.name,
    email: contactToUpdate.email,
    phone: contactToUpdate.phone,
    favorite,
  };

  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    updateBody,
    { new: true }
  );

  return updatedContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
