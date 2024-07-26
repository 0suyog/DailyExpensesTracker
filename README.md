
# To Use The Web App
### First clone the repo using
`git clone https://github.com/0suyog/DailyExpensesTracker
`
### Start the server
if you are running this for the first time then go to server folder and create a file with name `.env` and add this inside that file
```
DATABASE_URL="[Your mongodb connection string]"
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
### start react app
If you running this for the first time then go to ExpenseTracker and and create a file with name `.env` and add this inside that file
`VITE_SERVER_ADDRESS="[Your server end point]"`

If you are running this in your local machine server end point will be

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
### Then goto http://localhost:5173 to use the webapp
