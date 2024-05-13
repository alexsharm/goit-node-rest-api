import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const filePath = path.resolve("db", "contacts.json");

async function readContacts() {
  const data = await fs.readFile(filePath, { encoding: "utf-8" });

  return JSON.parse(data);
}

function writeContacts(contacts) {
  return fs.writeFile(filePath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
  const contacts = await readContacts();

  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readContacts();

  const contact = contacts.find((contact) => contact.id === contactId);

  if (typeof contact === "undefined") {
    return null;
  }

  return contact;
}

async function removeContact(contactId) {
  const contacts = await readContacts();

  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const removedContact = contacts[index];

  const newContacts = [
    ...contacts.slice(0, index),
    ...contacts.slice(index + 1),
  ];

  await writeContacts(newContacts);

  return removedContact;
}

async function addContact({ name, email, phone }) {
  const contacts = await readContacts();

  const newContact = { id: crypto.randomUUID(), name, email, phone };

  contacts.push(newContact);

  await writeContacts(contacts);

  return newContact;
}

async function updateContact(contactId, { name, email, phone }) {
  const contacts = await readContacts();

  const index = contacts.findIndex((contact) => contact.id === contactId);

  const contactToUpdate = contacts[index];

  let newName;
  let newEmail;
  let newPhone;

  name ? (newName = name) : (newName = contactToUpdate.name);
  email ? (newEmail = email) : (newEmail = contactToUpdate.email);
  phone ? (newPhone = phone) : (newPhone = contactToUpdate.phone);

  const updatedContacts = contacts.map((contact) =>
    contact.id === contactId
      ? { ...contact, name: newName, email: newEmail, phone: newPhone }
      : contact
  );

  const updatedContact = updatedContacts[index];

  if (!updatedContact) {
    return null;
  }

  await writeContacts(updatedContacts);

  return updatedContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
