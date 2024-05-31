import Contact from "../models/contact.js";

async function listContacts(ownerId) {
  const contacts = await Contact.find({ owner: ownerId });

  return contacts;
}

async function getContactById(contactId, ownerId) {
  const contact = Contact.findOne({ _id: contactId, owner: ownerId });

  if (typeof contact === "undefined") {
    return null;
  }

  return contact;
}

async function removeContact(contactId, ownerId) {
  const removedContact = await Contact.findOneAndDelete({
    _id: contactId,
    owner: ownerId,
  });

  if (removedContact === undefined) {
    return null;
  }

  return removedContact;
}

async function addContact(newContact) {
  const result = Contact.create(newContact);

  return result;
}

async function updateContact(contactId, ownerId, { name, email, phone }) {
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

  const updatedContact = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: ownerId,
    },
    updateBody,
    { new: true }
  );

  if (!updatedContact) {
    return null;
  }

  return updatedContact;
}

async function updateStatusContact(contactId, ownerId, favorite) {
  const contactToUpdate = await Contact.findById(contactId);

  const updateBody = {
    name: contactToUpdate.name,
    email: contactToUpdate.email,
    phone: contactToUpdate.phone,
    favorite,
  };

  const updatedContact = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: ownerId,
    },
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
