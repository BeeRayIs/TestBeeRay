import db from './init';
import bcrypt from 'bcryptjs';

export const seedDatabase = () => {
  const adminExists = db.prepare('SELECT * FROM users WHERE role = ?').get('admin');

  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(
      'admin@aihardware.com',
      hashedPassword,
      'Admin User',
      'admin'
    );
    console.log('Admin user created: admin@aihardware.com / admin123');
  }

  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };

  if (productCount.count === 0) {
    const products = [
      {
        name: 'NVIDIA H100 GPU',
        description: 'The most powerful GPU for AI training and inference. Perfect for large language models and deep learning.',
        price: 29999.99,
        category: 'GPU',
        image_url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800',
        stock: 15,
        specs: JSON.stringify({
          memory: '80GB HBM3',
          bandwidth: '3TB/s',
          fp64: '34 teraFLOPS',
          tdp: '700W'
        })
      },
      {
        name: 'NVIDIA A100 GPU',
        description: 'Enterprise-grade GPU for AI workloads. Excellent for training and inference at scale.',
        price: 12999.99,
        category: 'GPU',
        image_url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800',
        stock: 25,
        specs: JSON.stringify({
          memory: '40GB HBM2',
          bandwidth: '1.6TB/s',
          fp64: '19.5 teraFLOPS',
          tdp: '400W'
        })
      },
      {
        name: 'Google TPU v4',
        description: 'Custom-built tensor processing unit optimized for machine learning workloads.',
        price: 8999.99,
        category: 'TPU',
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        stock: 10,
        specs: JSON.stringify({
          memory: '32GB HBM2',
          performance: '275 teraFLOPS',
          interconnect: 'ICI',
          power: '200W'
        })
      },
      {
        name: 'Intel Habana Gaudi2',
        description: 'High-performance deep learning accelerator for training and inference.',
        price: 6499.99,
        category: 'Accelerator',
        image_url: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800',
        stock: 20,
        specs: JSON.stringify({
          memory: '96GB HBM2e',
          bandwidth: '2.45TB/s',
          fp32: '432 teraFLOPS',
          tdp: '600W'
        })
      },
      {
        name: 'AMD MI250X GPU',
        description: 'Dual-GPU accelerator designed for HPC and AI applications.',
        price: 10999.99,
        category: 'GPU',
        image_url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800',
        stock: 12,
        specs: JSON.stringify({
          memory: '128GB HBM2e',
          bandwidth: '3.2TB/s',
          fp64: '47.9 teraFLOPS',
          tdp: '560W'
        })
      },
      {
        name: 'Cerebras CS-2 Wafer',
        description: 'Revolutionary wafer-scale engine for AI training. The largest chip ever built.',
        price: 89999.99,
        category: 'Wafer-Scale',
        image_url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800',
        stock: 3,
        specs: JSON.stringify({
          cores: '850,000 cores',
          memory: '40GB on-chip',
          fabric: '220 Pb/s',
          size: '46,225 mm²'
        })
      },
      {
        name: 'Graphcore IPU-M2000',
        description: 'Intelligence Processing Unit designed for machine learning at scale.',
        price: 7499.99,
        category: 'IPU',
        image_url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800',
        stock: 18,
        specs: JSON.stringify({
          processors: '4 IPUs',
          memory: '3.6GB In-Processor',
          fp16: '1 petaFLOPS',
          power: '350W'
        })
      },
      {
        name: 'AWS Trainium Chip',
        description: 'Purpose-built machine learning training chip with high performance and cost efficiency.',
        price: 4999.99,
        category: 'Accelerator',
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        stock: 30,
        specs: JSON.stringify({
          memory: '32GB HBM',
          interconnect: 'NeuronLink',
          fp32: '190 teraFLOPS',
          optimization: 'PyTorch/TensorFlow'
        })
      }
    ];

    const insertStmt = db.prepare(`
      INSERT INTO products (name, description, price, category, image_url, stock, specs)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const product of products) {
      insertStmt.run(
        product.name,
        product.description,
        product.price,
        product.category,
        product.image_url,
        product.stock,
        product.specs
      );
    }

    console.log(`Seeded ${products.length} AI hardware products`);
  }
};
