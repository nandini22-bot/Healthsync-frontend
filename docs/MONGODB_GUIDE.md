# MongoDB Study Guide (Beginner Friendly)

This guide provides a comprehensive overview of MongoDB concepts for developers transitioning from relational SQL databases (like MySQL) to document-oriented databases.

---

## 1. MongoDB vs. Relational SQL Databases

In a relational database (SQL), data is stored in tables with rigid, predefined schemas. Relations are established using foreign keys and resolved using joins. In MongoDB, data is stored in flexible, JSON-like documents.

### Concept Comparison

| SQL Concept | MongoDB Equivalent | Description |
| :--- | :--- | :--- |
| **Database** | **Database** | A container for physical storage collections. |
| **Table** | **Collection** | A grouping of database documents (similar to rows in a table). |
| **Row** | **Document** | A single record representing an object (stored in BSON format). |
| **Column** | **Field** | A key-value pair within a document. |
| **Primary Key** | **_id / ObjectId** | Unique identifier automatically created for each document. |
| **Foreign Key** | **Reference / DBRef** | A field containing the `_id` of another document. |
| **Table Join** | **Aggregation ($lookup)** | Linking collections dynamically during query pipelines. |

---

## 2. Core MongoDB Concepts

### A. Document Structure
Documents are key-value pairs stored in **BSON** (Binary JSON). This allows nested arrays and sub-documents:

```json
{
  "_id": {"$oid": "60d5ec493b8c6e2b34f8a3c1"},
  "email": "user@example.com",
  "profile": {
    "age": 24,
    "height": 175
  },
  "allergies": ["Peanuts", "Gluten"]
}
```

### B. The `_id` and `ObjectId`
* Every MongoDB document requires an `_id` field acting as a primary key.
* If not specified, MongoDB automatically assigns a 12-byte unique identifier called an `ObjectId`.
* An `ObjectId` contains a timestamp, machine identifier, process ID, and an incrementing counter, ensuring fast generation and sorting.

### C. Embedding vs. Referencing (Data Modeling)

#### 1. Embedding (Denormalization)
Storing related data directly inside a single parent document (e.g. sub-documents or arrays).
* **When to use**: One-to-One or One-to-Few relationships, and data that is read together frequently (e.g., user profiles, reminders inside medications).
* **Pros**: Rapid, single-document read/write queries without joins.
* **Cons**: Documents have a 16MB maximum size limit.

#### 2. Referencing (Normalization)
Storing related data in separate collections and linking them using an identifier.
* **When to use**: One-to-Many or Many-to-Many relationships, or when data grows dynamically (e.g., workout logs, daily meals logged over years).
* **Pros**: Prevents document size bloat; clean separation.
* **Cons**: Requires multiple queries or aggregation steps to resolve relationships.

---

## 3. Basic CRUD Operations (Node.js Driver)

Here is how common queries compare between SQL and MongoDB:

### A. Create (Insert)
* **SQL**: `INSERT INTO users (email, password_hash) VALUES ('user@test.com', 'hash');`
* **MongoDB**:
  ```javascript
  await db.collection('users').insertOne({ email: 'user@test.com', passwordHash: 'hash' });
  ```

### B. Read (Find)
* **SQL**: `SELECT * FROM users WHERE email = 'user@test.com';`
* **MongoDB**:
  ```javascript
  const user = await db.collection('users').findOne({ email: 'user@test.com' });
  ```

### C. Update
* **SQL**: `UPDATE users SET reset_token = '123456' WHERE email = 'user@test.com';`
* **MongoDB**:
  ```javascript
  await db.collection('users').updateOne(
    { email: 'user@test.com' },
    { $set: { resetToken: '123456' } }
  );
  ```

### D. Delete
* **SQL**: `DELETE FROM users WHERE id = 123;`
* **MongoDB**:
  ```javascript
  await db.collection('users').deleteOne({ _id: new ObjectId("123") });
  ```

---

## 4. Aggregation Pipelines
Instead of table JOINS, MongoDB uses **Aggregation Pipelines**, which pass documents through multi-stage operators:

* **$match**: Filters documents (similar to SQL `WHERE`).
* **$group**: Groups documents by a key to calculate averages, sums, etc. (similar to SQL `GROUP BY`).
* **$lookup**: Performs left outer joins to another collection (similar to SQL `LEFT JOIN`).
* **$project**: Reshapes fields returned (similar to SQL `SELECT column1, column2`).

Example: Finding total calories burned per user:
```javascript
const result = await db.collection('activityLogs').aggregate([
  { $match: { userId: authenticatedUserId } },
  { $group: { _id: "$logDate", totalCalories: { $sum: "$caloriesBurned" } } }
]).toArray();

---

## 5. Connection Data Flow Pipeline

For a beginner, understanding how your cloud database links to your code is essential. Here is the exact data-flow path:

```text
[MongoDB Atlas Cloud Cluster]
     ↓ (Exposes Connection string username:password@cluster)
[.env.local Configuration]
     ↓ (Stores string in process.env.MONGODB_URI)
[lib/mongodb.ts Caching Module]
     ↓ (MongoClient parses URI, opens TCP sockets, caches connection promise)
[Backend Service File]
     ↓ (Resolves clientPromise, selects database databaseInstance = client.db())
[CRUD Query Operations]
     ↓ (Executes queries like db.collection('users').findOne())
[Next.js Server Page / API Route]
     ↓ (Receives data objects, renders HTML or returns JSON)
[User UI Dashboard]
```
```
