# MongoDB Atlas Setup & Database Seeding Guide

This guide walks through configuring a free cloud-hosted MongoDB Atlas cluster, linking it to your Next.js application, and seeding reference catalogs.

---

## Step 1: Create a Free MongoDB Atlas Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Log in and create a new Project (e.g. `HealthSync`).

## Step 2: Provision a Free Database Cluster
1. Click **Create** to deploy a new database.
2. Select the **M0 Shared Free Tier** option.
3. Choose your preferred cloud provider (e.g. AWS) and select a region (e.g. `ap-south-1` for Mumbai / India, or nearest to you).
4. Click **Create Cluster**.

## Step 3: Configure Database Access (Users)
1. In the left navigation menu, click **Database Access** under the Security section.
2. Click **Add New Database User**.
3. Set authentication method to **Password**.
4. Configure a username and secure password (avoid using special characters like `@` or `:` inside the password to prevent URI parsing errors).
5. Set Database User Privileges to **Read and write to any database**.
6. Click **Add User**.

## Step 4: Configure Network Access (IP Access List)
1. Click **Network Access** under the Security section.
2. Click **Add IP Address**.
3. Select **Allow Access From Anywhere** (IP `0.0.0.0/0`) for development convenience.
4. Click **Confirm** (it takes about 1 minute to deploy).

## Step 5: Retrieve Connection URI
1. Return to the **Database Deployments** page.
2. Click the **Connect** button on your cluster.
3. Select **Drivers** (Node.js).
4. Copy the connection string. It will look like this:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Replace `<username>` and `<password>` with the database user credentials created in Step 3.

## Step 6: Configure Next.js Environment
1. Open `.env.local` in your root project folder.
2. Assign the connection string to `MONGODB_URI`:
   ```text
   MONGODB_URI=mongodb+srv://yourUserName:yourPassword@cluster0.xxxx.mongodb.net/healthsync?retryWrites=true&w=majority
   ```
   *(Specifying `/healthsync` after the cluster URL points the connection pool directly to a database named `healthsync`).*

## Step 7: Run Seeding & Mappings Migration
1. Run the following command in the root folder terminal:
   ```bash
   npm run seed
   ```
2. The seeder script connects to Atlas, drops old mock catalogs, creates text indices for searches, and inserts the regional Indian brand catalog.
3. **Verification**: Log into the Atlas website, go to **Database -> Browse Collections**, and verify that the `medicines` collection contains the seeded brand-name documents.
