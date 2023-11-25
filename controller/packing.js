// routes/packing.js

import express from 'express';
import Packing from '../models/packinglist.js';


// POST request to create a new packing record
const Packinglist = async (req, res) => {
  const {
    buyer,
    factory,
    totalcartoon,
    invoicenumber,
    slots,
    products,
  } = req.body;

  try {
    // Validate required fields
    if (!buyer || !factory || !totalcartoon || !invoicenumber || !slots || !products) {
      return res.status(422).json({ status: 422, error: 'Please provide all the necessary fields' });
    }

    const newPacking = new Packing({
      buyer,
      factory,
      totalcartoon,
      invoicenumber,
      slots,
      products,
    });

    const savedPacking = await newPacking.save();

    res.status(201).json({ message: 'New packing record created'});
  } catch (error) {
    console.error('Error creating new packing record:', error.message);
    res.status(500).json({ message: 'Error creating new packing record', error: error.message });
  }
};

export {Packinglist};
