require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function seed() {
    try {
        console.log("🔄 Creando usuario admin...");

        const hashedPassword = await bcrypt.hash("admin123", 10);

        const query = `
            INSERT INTO users (email, password, full_name, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING;
        `;

        const values = [
            "admin@pos.com",
            hashedPassword,
            "Administrador",
            "admin"
        ];

        await pool.query(query, values);

        console.log("✅ Usuario admin creado o ya existente.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        process.exit(1);
    }
}

seed();
