const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// ==========================================
// CONFIGURACIONES
// ==========================================
app.use(cors());
// Aumentamos el límite porque las imágenes en Base64 son textos muy largos
app.use(express.json({ limit: '50mb' })); 

// ==========================================
// CONEXIÓN A LA BASE DE DATOS
// ==========================================
const db = mysql.createConnection({
    host: 'b1wzqw9seyvyfhjiodlz-mysql.services.clever-cloud.com',
    user: 'uiefd1ljfmbjjdmr',
    password: 'QMrkWcWEJIRiCjUQbPk2', 
    database: 'b1wzqw9seyvyfhjiodlz'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
    } else {
        console.log('✅ ¡Conectado a la base de datos urban_jungle exitosamente!');
    }
});

// ==========================================
// RUTAS DE LA API (Endpoints)
// ==========================================

// 1. Obtener todos los productos (Para que el cliente los vea en el menú)
app.get('/api/productos', (req, res) => {
    const query = 'SELECT * FROM productos';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error al obtener los productos' });
        }
        res.json(results);
    });
});

// 2. Agregar un nuevo producto (Para cuando usas el panel de Admin)
app.post('/api/productos', (req, res) => {
    const { nombre, descripcion, precio, precioViejo, categoria, imagen } = req.body;
    
    const query = `
        INSERT INTO productos (nombre, descripcion, precio, precioViejo, categoria, imagen) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [nombre, descripcion, precio, precioViejo, categoria, imagen], (err, result) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            return res.status(500).json({ error: 'Error al guardar el producto' });
        }
        res.json({ message: 'Producto agregado exitosamente', id: result.insertId });
    });
});

// 3. Eliminar un producto (Para el tachito de basura en el Admin)
app.delete('/api/productos/:id', (req, res) => {
    const idProducto = req.params.id;
    const query = 'DELETE FROM productos WHERE id = ?';
    
    db.query(query, [idProducto], (err, result) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            return res.status(500).json({ error: 'Error al eliminar el producto' });
        }
        res.json({ message: 'Producto eliminado exitosamente' });
    });
});

// ==========================================
// ARRANQUE DEL SERVIDOR
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});