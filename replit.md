# Boutique Premium

## Overview
A French boutique e-commerce web application built with Node.js and Express. Features product management with an admin panel and customer testimonial video functionality.

## Project Structure
- `server.js` - Express server serving static files and API endpoints
- `index.html` - Main storefront page
- `admin.html` - Admin panel for managing products and testimonial video
- `script.js` - Frontend JavaScript
- `style.css` - Styling

## API Endpoints
- `GET /api/produits` - Get all products
- `POST /api/admin/produit` - Add a product (requires password)
- `DELETE /api/admin/produit/:id` - Delete a product (requires password)
- `POST /api/admin/video` - Set testimonial video (requires password)
- `GET /api/video` - Get testimonial video

## Running the Application
- Server runs on port 5000 (bound to 0.0.0.0)
- Start with `npm start`

## Recent Changes
- 2026-01-11: Configured for Replit environment (port 5000, host 0.0.0.0)
