
# To Use The Web App
### First clone the repo using
`git clone https://github.com/0suyog/DailyExpensesTracker
`
### Start the server
if you are running this for the first time then go to the server folder and create a file with the name `.env` and add this inside that file
```
DATABASE_URL="[Your mongodb connection string]"

```

if you are trying to connectMongoDBgodb in your local machine then the connection string usually is
 ```
mongodb://localhost:27017/Expenses
```
then
```
cd server
npm i
npm start
```
If not the first time then just
```
cd server
npm start
```
### Start react app
If you are running this for the first time then go to ExpenseTracker and create a file with the name `.env` and add this inside that file
`VITE_SERVER_ADDRESS="[Your server end point]"`

If you are running this on your local machine server endpoint will be

`http://localhost:3000`
```
cd ExpenseTracker
npm i
npm run build
npm start
```
else
```
cd ExpenseTracker
npm start
```
### Then go to http://localhost:5173 to use the webapp
