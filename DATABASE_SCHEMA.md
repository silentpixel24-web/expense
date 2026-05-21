# Database Schema (MongoDB)

## Collections

### users
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| email | String | Unique, lowercase |
| password | String | Bcrypt hashed |
| role | Enum | admin, treasurer, accountant, viewer |
| phone | String | Optional |
| isActive | Boolean | Default true |
| lastLogin | Date | |

### incomes
| Field | Type | Notes |
|-------|------|-------|
| receiptNumber | String | Auto-generated INC-YYYY-##### |
| source | Enum | friday_collection, donation_box, zakat, etc. |
| amount | Number | |
| date | Date | |
| donorName | String | Optional |
| paymentMethod | Enum | cash, upi, bank, card, online |
| receiptImage | String | Upload path |
| isPublic | Boolean | Shown on public portal |
| createdBy | ObjectId → users | |
| auditHash | String | SHA-256 tamper evidence |

### expenditures
| Field | Type | Notes |
|-------|------|-------|
| referenceNumber | String | Auto EXP-YYYY-##### |
| category | Enum | electricity, imam_salary, etc. |
| amount | Number | |
| status | Enum | pending, approved, rejected |
| approvedBy | ObjectId → users | |
| isRecurring | Boolean | Monthly recurring flag |
| billAttachment | String | |
| auditHash | String | |

### activitylogs
| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | |
| action | String | CREATE, UPDATE, LOGIN, etc. |
| entity | String | Income, Expenditure, User |
| hash | String | Chained SHA-256 |
| previousHash | String | Previous log hash |

### notices, assets, employees, events, maintenancelogs, inventory
See model files in `backend/src/models/`.

## Indexes
- incomes: date, source, receiptNumber (unique)
- expenditures: date, status, category, referenceNumber (unique)
- activitylogs: createdAt, user
