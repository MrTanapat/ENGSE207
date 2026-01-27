# 🏗️ Multi-VM N-Tier Setup Report (ENGSE207)

## 1. Network Configuration
| VM | Role | Private IP | Software |
|----|------|------------|----------|
| VM1 | Web Tier | 10.0.0.10 | Nginx (Reverse Proxy) |
| VM2 | App Tier | 10.0.0.20 | Node.js (Express API) |
| VM3 | Data Tier| 10.0.0.30 | PostgreSQL 14 |

## 2. Key Implementation Details
- **Database Isolation:** PostgreSQL configured to listen only on internal network.
- **Security:** Nginx handles SSL Termination and forwards clean HTTP to App Tier.
- **Automation:** Infrastructure provisioned using Vagrant.

## 3. Verification
- `curl -k https://10.0.0.10/api/tasks` returns 200 OK from DB.