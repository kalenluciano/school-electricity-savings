# School Electricity Savings Calculator Backend

### By: Kalen Luciano: [GitHub](https://github.com/kalenluciano) | [LinkedIn](https://www.linkedin.com/in/kalenluciano/)

#### [School Electricity Savings Calculator Frontend](https://github.com/kalenluciano/school-electricity-savings-frontend)

#### [Deployed Site](https://school-electricity-savings.herokuapp.com/)

---

### **_Description_**

The Inflation Reduction Act provided significant incentives to drive America toward a clean energy future. However, the ever-evolving guidelines surrounding the tax incentives can make it difficult to understand what credits apply to each community. I studied the legislation and the latest guidance from the IRS and EPA to determine how schools can save money converting to clean energy.

With this understanding, I developed a user-friendly calculator that empowers environmental activists to determine the potential savings their schools are eligible for. By leveraging Census and Google Maps APIs and technologies and frameworks such as TypeScript, Next.js, Express, PostgreSQL, and Node.js, I built a full-stack application that helps schools make informed decisions about their clean energy transition.

This app was inspired by (Rewiring America's household IRA savings calculator)[https://www.rewiringamerica.org/app/ira-calculator].

---

### **_Getting Started_**

-   `Fork` and `clone`
-   `cd` into the directory
-   Run `sequelize db:create`
-   Run `sequelize db:migrate`
-   Run `sequelize db:seed:all`
-   Run `npm run dev`

---

### **_Technologies_**

-   PostgreSQL
-   Express.js
-   Node.js
-   JavaScript

---

### **_Future Updates_**

-   [ ] Improve the speed for querying the savings for a given address
-   [ ] Store previous query results to prevent duplicate queries
-   [ ] Automate a process to update brownfield sites in the database as the EPA releases new data or find a way to use the EPA API to get the appropriate data on demand instead of storing it in the database
-   [ ] Refine queries for more nuanced qualifications as guidelines from the EPA and IRS are released
