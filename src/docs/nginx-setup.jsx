import { CheckCircle, Cloud, Code, Copy, FileText, Globe, Lock, Server, Terminal } from "lucide-react";
import { useState } from "react";

export default function NginxEC2Setup() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const CodeBlock = ({ code, index, language = "bash" }) => (
    <div className="relative bg-slate-900 rounded-lg p-4 my-3">
      <button
        onClick={() => copyToClipboard(code, index)}
        className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors"
      >
        {copiedIndex === index ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre className="text-sm text-green-400 overflow-x-auto pr-12">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Cloud className="w-12 h-12 text-orange-500" />
            <h1 className="text-4xl font-bold text-slate-800">Setup Nginx on AWS EC2</h1>
          </div>
          <p className="text-slate-600 text-lg">Complete step-by-step guide with code examples</p>
        </div>

        {/* Step 1: Launch EC2 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Step 1: Launch EC2 Instance</h2>
          </div>

          <div className="space-y-3 text-slate-700">
            <p className="font-semibold">1. Go to AWS Console → EC2 → Launch Instance</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>AMI:</strong> Ubuntu Server 22.04 LTS (or Amazon Linux 2023)
              </li>
              <li>
                <strong>Instance Type:</strong> t2.micro (free tier eligible)
              </li>
              <li>
                <strong>Key Pair:</strong> Create or select existing key pair
              </li>
              <li>
                <strong>Security Group:</strong> Allow SSH (22), HTTP (80), HTTPS (443)
              </li>
            </ul>
          </div>

          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm font-semibold text-yellow-800">⚠️ Security Group Rules:</p>
            <div className="text-sm text-yellow-700 mt-2">
              • SSH (22) - Your IP only
              <br />
              • HTTP (80) - 0.0.0.0/0
              <br />• HTTPS (443) - 0.0.0.0/0
            </div>
          </div>
        </div>

        {/* Step 2: Connect to EC2 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Terminal className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Step 2: Connect to EC2</h2>
          </div>

          <p className="text-slate-700 mb-3">Connect via SSH using your key pair:</p>
          <CodeBlock
            code={`# Change permissions on your key file
chmod 400 your-key.pem

# Connect to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# For Amazon Linux
ssh -i your-key.pem ec2-user@your-ec2-public-ip`}
            index={0}
          />
        </div>

        {/* Step 3: Update System */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Terminal className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Step 3: Update System Packages</h2>
          </div>

          <CodeBlock
            code={`# For Ubuntu
sudo apt update
sudo apt upgrade -y

# For Amazon Linux
sudo yum update -y`}
            index={1}
          />
        </div>

        {/* Step 4: Install Nginx */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Server className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Step 4: Install Nginx</h2>
          </div>

          <CodeBlock
            code={`# For Ubuntu
sudo apt install nginx -y

# For Amazon Linux
sudo amazon-linux-extras install nginx1 -y

# Start Nginx
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx`}
            index={2}
          />

          <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-sm font-semibold text-green-800">✅ Verify Installation:</p>
            <p className="text-sm text-green-700 mt-2">
              Visit http://your-ec2-public-ip in your browser. You should see the Nginx welcome page!
            </p>
          </div>
        </div>

        {/* Step 5: Configure Nginx */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Step 5: Configure Nginx</h2>
          </div>

          <p className="text-slate-700 mb-3 font-semibold">A. Basic Static Website Configuration:</p>
          <CodeBlock
            code={`# Create directory for your website
sudo mkdir -p /var/www/mywebsite

# Create a sample HTML file
sudo nano /var/www/mywebsite/index.html`}
            index={3}
          />

          <p className="text-slate-700 mb-3 mt-4">Add this HTML content:</p>
          <CodeBlock
            code={`<!DOCTYPE html>
<html>
<head>
    <title>My Nginx Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        h1 { font-size: 3em; text-align: center; }
        p { font-size: 1.2em; text-align: center; }
    </style>
</head>
<body>
    <h1>🚀 Welcome to My Nginx Server!</h1>
    <p>Running on AWS EC2</p>
    <p>Server is working perfectly!</p>
</body>
</html>`}
            index={4}
          />

          <p className="text-slate-700 mb-3 mt-6 font-semibold">B. Create Nginx Server Block:</p>
          <CodeBlock
            code={`# Create new server block configuration
sudo nano /etc/nginx/sites-available/mywebsite`}
            index={5}
          />

          <p className="text-slate-700 mb-3 mt-4">Add this configuration:</p>
          <CodeBlock
            code={`server {
    listen 80;
    listen [::]:80;
    
    server_name your-domain.com www.your-domain.com;
    # Or use EC2 public IP: server_name your-ec2-ip;
    
    root /var/www/mywebsite;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}`}
            index={6}
          />

          <p className="text-slate-700 mb-3 mt-6 font-semibold">C. Enable the Configuration:</p>
          <CodeBlock
            code={`# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/mywebsite /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx`}
            index={7}
          />
        </div>

        {/* Step 6: Reverse Proxy Setup */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Code className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Step 6: Reverse Proxy (Optional)</h2>
          </div>

          <p className="text-slate-700 mb-3">For proxying to a Node.js/Python/Java backend app:</p>
          <CodeBlock
            code={`server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;  # Your app port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Serve static files directly
    location /static {
        alias /var/www/mywebsite/static;
        expires 30d;
    }
}`}
            index={8}
          />
        </div>

        {/* Step 7: SSL Setup */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Step 7: Setup SSL (HTTPS)</h2>
          </div>

          <p className="text-slate-700 mb-3">Using Let's Encrypt (Free SSL):</p>
          <CodeBlock
            code={`# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (make sure DNS is pointed to your server)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run

# Certificates auto-renew every 90 days`}
            index={9}
          />
        </div>

        {/* Step 8: Common Commands */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Terminal className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Step 8: Useful Nginx Commands</h2>
          </div>

          <CodeBlock
            code={`# Test configuration
sudo nginx -t

# Reload (without downtime)
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# Stop
sudo systemctl stop nginx

# Start
sudo systemctl start nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check Nginx version
nginx -v

# Check all running processes
ps aux | grep nginx`}
            index={10}
          />
        </div>

        {/* Load Balancing Example */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Bonus: Load Balancing Configuration</h2>
          </div>

          <CodeBlock
            code={`upstream backend_servers {
    # Load balancing method (default: round-robin)
    least_conn;  # or ip_hash; or least_time;
    
    server 10.0.1.10:3000 weight=3;
    server 10.0.1.11:3000 weight=2;
    server 10.0.1.12:3000 weight=1;
    server 10.0.1.13:3000 backup;  # Only if others fail
}

server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # Health check
        proxy_next_upstream error timeout http_500 http_502 http_503;
    }
}`}
            index={11}
          />
        </div>

        {/* Troubleshooting */}
        <div className="bg-slate-800 text-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">🔧 Troubleshooting Tips</h2>

          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-yellow-400">Problem: Can't access website</p>
              <p>• Check Security Group allows port 80/443</p>
              <p>
                • Verify Nginx is running:{" "}
                <code className="bg-slate-700 px-2 py-1 rounded">sudo systemctl status nginx</code>
              </p>
              <p>
                • Check firewall: <code className="bg-slate-700 px-2 py-1 rounded">sudo ufw status</code>
              </p>
            </div>

            <div>
              <p className="font-semibold text-yellow-400">Problem: Configuration errors</p>
              <p>
                • Always test config: <code className="bg-slate-700 px-2 py-1 rounded">sudo nginx -t</code>
              </p>
              <p>
                • Check error logs:{" "}
                <code className="bg-slate-700 px-2 py-1 rounded">sudo tail -f /var/log/nginx/error.log</code>
              </p>
            </div>

            <div>
              <p className="font-semibold text-yellow-400">Problem: Permission denied</p>
              <p>
                • Check file ownership:{" "}
                <code className="bg-slate-700 px-2 py-1 rounded">
                  sudo chown -R www-data:www-data /var/www/mywebsite
                </code>
              </p>
              <p>
                • Set proper permissions:{" "}
                <code className="bg-slate-700 px-2 py-1 rounded">sudo chmod -R 755 /var/www/mywebsite</code>
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">🎉 You're All Set!</h2>
          <p className="text-center text-lg">
            Your Nginx server is now running on AWS EC2. Visit your public IP or domain to see it in action!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded">✅ Nginx Installed</div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded">✅ Website Configured</div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded">✅ Security Enabled</div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded">✅ Production Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
}
