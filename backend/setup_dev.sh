#!/bin/bash
# Development setup script for Monasib

echo "🔧 Setting up Monasib development environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate  # For Linux/Mac
# For Windows: venv\Scripts\activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Copy environment file
echo "⚙️ Setting up environment configuration..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo "📝 Please edit .env file with your configuration"
else
    echo "ℹ️ .env file already exists"
fi

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Run tests
echo "🧪 Running tests..."
pytest tests/ -v

echo "✅ Development environment setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   python server.py"
echo ""
echo "📚 API Documentation:"
echo "   http://localhost:8888/docs"
echo ""
echo "🌐 Frontend Application:"
echo "   http://localhost:8888/app"
