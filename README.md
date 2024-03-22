[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/ttC5_kKh)

# Sprint 1 Planning Meeting Agenda

**Objective:**  
The objective of this meeting is to kickstart our project's first sprint by aligning on goals, clarifying roles and responsibilities, and planning the tasks for the sprint.

## Meeting Details
- **Date:** 3/21/2024
- **Time:** 7:20 AM
- **Location:** Zachry Engineering Building

## Agenda Items

1. **Welcome and Introductions** (5 minutes)
   - Brief introduction of team members, including roles and responsibilities.

2. **Overview of Project** (5 minutes)
   - Recap of project goals, scope, and timeline.
   - Brief overview of the product and requirements.

3. **Explanation of Agile/Scrum Process** (5 minutes)
   - Overview of Agile methodology and Scrum framework.
   - Explanation of roles.
   - Overview of sprint cycles, including duration and goals.

4. **Establish Sprint Goal** (5 minutes)
   - Discussion to define the primary objective for the first sprint.
   - Alignment on what success looks like for this sprint.

5. **Product Backlog Review** (5 minutes)
   - Review of user stories and tasks in the product backlog.
   - Prioritization of backlog items for the first sprint.

6. **Sprint Planning** (10 minutes)
   - Breakdown of selected user stories into tasks.
   - Estimation of effort for each task.
   - Assignment of tasks to team members.

7. **Definition of Done** (3 minutes)
   - Clarification of the criteria that need to be met for a task or user story to be considered complete.
   - Agreement on the definition of done for the sprint.

8. **Communication and Reporting** (2 minutes)
   - Discussion on communication channels.
   - Agreement on frequency and format of progress reporting.

9. **Q&A and Open Discussion** (3 minutes)
   - Opportunity for team members to ask questions or seek clarification on any aspect of the project or sprint planning process.

10. **Next Steps and Closing** (2 minutes)
    - Recap of action items and responsibilities.
    - Confirmation of next meeting date and time.
    - Thank everyone for their participation and commitment.

# Sprint 1 Meeting Minutes

**Date:** 3/21/2024  
**Time:** 7:20 AM  
**Location:** Zachry Engineering Building  

## Attendees  
- Aditya  
- Isaac  
- Kelvin  
- Kunal  
- Wyatt  
- Karan  

## Agenda Items  

1. **Welcome and Introductions**  (7:20 - 7:25 AM, 5 minutes)
   All team members arrived punctually at the Zachry Engineering Building. Each member was assigned the role of a full stack developer. 

2. **Overview of Project**  (7:25 - 7:30 AM, 5 minutes) 
   The team discussed the scope of Sprint 1, aiming to outline goals. The project involves developing a web app for our POS and inventory management system within a framework.  

3. **Explanation of Agile/Scrum Process**  (7:30 - 7:35 AM, 5 minutes)
   The team reviewed the Agile and Scrum framework, clarifying roles and responsibilities. Sprint cycles, duration, and goals were discussed to ensure alignment.  

4. **Establish Sprint Goal**  (7:35 - 7:40 AM, 5 minutes)
   The group decided to focus Sprint 1 on reproducing the front end of the previous project, adding customer and menu board views, and modifying databases.  

5. **Product Backlog Review**  (7:40 - 7:45 AM, 5 minutes)
   Backlog items were prioritized based on the Sprint 1 goal of front-end reproduction, adding the new views, and database modification.  

6. **Sprint Planning**  (7:45 - 7:55 AM, 10 minutes)
   Tasks were broken down from user stories, with preliminary estimations and assignments. Task allocation may be adjusted later.  

7. **Definition of Done**  (7:55 - 7:58 AM, 3 minutes)
   Criteria for task and user story completion were clarified, focusing on Sprint 1 goals of rebuilding the front end and modifying databases.  

8. **Communication and Reporting** (7:58 - 8:00 AM, 2 minutes)  
   Daily communication frequency was agreed upon, along with a common communication platform of discord.  

9. **Q&A and Open Discussion**  (8:00 - 8:03 AM, 3 minutes)
   Questions were raised regarding user stories and framework specifications, providing clarity for the team.  

10. **Next Steps and Closing**  (8:03 - 8:05 AM, 2 minutes)
    Meeting objectives were summarized, the next meeting date confirmed, and appreciation expressed for attendance.  

**TOTAL MEETING TIME: 7:20 - 8:05 AM, 45 minutes**

## Miscellaneous  
- The team is in the process of deciding between NEXT.js, Flask, and PSQL for the framework structure.

# Sprint 1 Plan

## Sprint Objective
The objective of Sprint 1 is to kickstart the project by focusing on the initial setup and development tasks. The main goals include:
- Rebuilding the front-end code served on one server, including selecting a suitable framework, assessing compatibility, and implementing key features.
- Migrating the back-end code to another server, ensuring compatibility with the revamped front-end, and implementing necessary features and database adjustments.

## Initial Sprint Backlog

### As a developer, I would like to have the front-end code served on one server (5 tasks) [A]

- **A1: Research and select a suitable framework for rebuilding the GUI of the POS system**
  - **Dependencies:** None
  - **Assigned to:** Wyatt
  - **Time Estimate:** 1 HR, 1 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Framework selected based on research

- **A2: Assess the compatibility, scalability, and usability of potential frameworks to determine the best fit for the project**
  - **Dependencies:** A1
  - **Assigned to:** Wyatt
  - **Time Estimate:** 0.5 HR, 1 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Frameworks assessed for compatibility, scalability, and usability.

- **A3: Plan and execute the migration process to transition the existing GUI components to the new framework seamlessly**
  - **Dependencies:** A2
  - **Assigned to:** All
  - **Time Estimate:** 1.5 HR, 2 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Migration plan executed seamlessly. Implementation reviewed, tested, and successfully transitioned.

- **A4: Create a dedicated menu board view to display product offerings, prices, and promotions in a visually appealing and informative manner**
  - **Dependencies:** A3
  - **Assigned to:** Kunal
  - **Time Estimate:** 2.5 HR, 3 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Menu board view created with product offerings, prices, and promotions. Implementation reviewed, tested, and visually appealing.

- **A5: Implement a customer view. This should be different from the cashier view, it should be more accessible and easier to navigate**
  - **Dependencies:** A3
  - **Assigned to:** Karan and Kelvin
  - **Time Estimate:** 4 HR, 5 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Customer view implemented for accessibility and ease of navigation. Implementation reviewed, tested, and distinct from the cashier view.


### As a developer, I would like to have the back-end code served on another server (19 tasks) [B]

- **B1: Analyze the impact of GUI redesign on the database schema and data structure**
  - **Dependencies:** A
  - **Assigned to:** All
  - **Time Estimate:** 0.5 HR, 1 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Analysis completed, and necessary adjustments identified. Changes reviewed and aligned with the revamped GUI.

- **B2: Modify database schema as necessary to align with the revamped GUI**
  - **Dependencies:** B1
  - **Assigned to:** All
  - **Time Estimate:** 1 HR, 2 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Database schema modified successfully to align with GUI changes. Any new/modified relations are normalized appropriately. Changes reviewed and tested for compatibility.

- **B3: Update database queries and data relationships to support new GUI features**
  - **Dependencies:** B2
  - **Assigned to:** All
  - **Time Estimate:** 3 HR, 4 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Database queries and relationships updated to support new GUI features. Changes reviewed and tested for accuracy.

- **B4: Migrate the logic for the “What Sells Together” manager feature over to the back-end server and create a view for this data in the UI**
  - **Dependencies:** B3
  - **Assigned to:** Wyatt
  - **Time Estimate:** 3 HR, 4 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Feature migrated successfully to the web server. Implementation reviewed, tested, and functioning as expected.

- **B5: Migrate the logic for the “Restock Report” manager feature over to the back-end server and create a view for this data in the UI**
  - **Dependencies:** B3
  - **Assigned to:** Aditya
  - **Time Estimate:** 3 HR, 4 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Feature migrated successfully to the web server. Implementation reviewed, tested, and functioning as expected.

- **B6: Migrate the logic for the “Product Usage” manager feature over to the back-end server and create a view for this data in the UI**
  - **Dependencies:** B3
  - **Assigned to:** Kunal
  - **Time Estimate:** 3 HR, 4 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Feature migrated successfully to the web server. Implementation reviewed, tested, and functioning as expected.

- **B7: Migrate the logic for the “Seasonal item” manager feature over to the back-end server and create a view for this data in the UI**
  - **Dependencies:** B3
  - **Assigned to:** Isaac
  - **Time Estimate:** 2.5 HR, 3 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Feature migrated successfully to the web server. Implementation reviewed, tested, and functioning as expected.

- **B8: Migrate the logic for the “Excess Report” manager feature over to the back-end server and create a view for this data in the UI**
  - **Dependencies:** B3
  - **Assigned to:** Karan
  - **Time Estimate:** 3 HR, 4 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Feature migrated successfully to the web server. Implementation reviewed, tested, and functioning as expected.

- **B9: Migrate the logic for the “Sales Report” manager feature over to the back-end server and create a view for this data in the UI**
  - **Dependencies:** B3
  - **Assigned to:** Kelvin
  - **Time Estimate:** 3 HR, 4 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Feature migrated successfully to the web server. Implementation reviewed, tested, and functioning as expected.

- **B10: Migrate the logic to add menu items and create an interactive component in the UI to support this functionality**
  - **Dependencies:** B3
  - **Assigned to:** Isaac
  - **Time Estimate:** 2.5 HR, 3 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Functionality migrated successfully to the web server. Implementation reviewed, tested, and functioning as expected.

- **B11: Migrate the logic to update menu items and create an interactive component in the UI to support this functionality**
  - **Dependencies:** B3
  - **Assigned to:** Isaac
  - **Time Estimate:** 2.5 HR, 3 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Functionality migrated successfully to the web server. Implementation reviewed, tested, and functioning as expected.

- **B12: Migrate the logic to add inventory items and create an interactive component in the UI to support this functionality**
  - **Dependencies:** B3
  - **Assigned to:** Aditya
  - **Time Estimate:** 2.5 HR, 3 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Functionality migrated successfully to the web server. Implementation reviewed, tested, and functioning as expected.

- **B13: Migrate the logic to update inventory items and create an interactive component in the UI to support this functionality**
  - **Dependencies:** B3
  - **Assigned to:** Aditya
  - **Time Estimate:** 2.5 HR, 3 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Functionality migrated successfully to the web server. Implementation reviewed, tested, and functioning as expected.

- **B14: Migrate the logic to choose between three payment options**
  - **Dependencies:** B3
  - **Assigned to:** Kelvin
  - **Time Estimate:** 2 HR, 2 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Functionality migrated successfully to the web server. Implementation reviewed, tested, and functioning as expected.

- **B15: Migrate the logic to add items and remove items from the transaction and create an interactive component in the UI to support this functionality**
  - **Dependencies:** B3
  - **Assigned to:** Wyatt
  - **Time Estimate:** 3.5 HR, 4 pt
  - **Priority:** High
  - **Status:** To-do
  - **Definition of Done:** Functionality migrated successfully to the web server. Implementation reviewed, tested, and functioning as expected.

- **B16: Add the ability to customize menu items and create interactive components in the UI to support this functionality**
  - **Dependencies:** B3
  - **Assigned to:** Kunal
  - **Time Estimate:** 3 HR, 3 pt
  - **Priority:** Medium
  - **Status:** To-do
  - **Definition of Done:** Feature implemented and tested successfully. Customization options reviewed and functioning as expected.

- **B17: Integrate menu board data dynamically with the database to ensure real-time updates and synchronization with the POS system**
  - **Dependencies:** B3
  - **Assigned to:** Kunal
  - **Time Estimate:** 2 HR, 2 pt
  - **Priority:** Medium
  - **Status:** To-do
  - **Definition of Done:** Integration completed successfully, ensuring real-time updates. Functionality reviewed and synchronized with the POS system.

- **B18: Implement backend logic to support real-time menu board updates and create an interactive component in the UI to support this functionality**
  - **Dependencies:** B3
  - **Assigned to:** Karan
  - **Time Estimate:** 2 HR, 2 pt
  - **Priority:** Medium
  - **Status:** To-do
  - **Definition of Done:** Backend logic implemented to support real-time updates. Functionality reviewed and synchronized with the front end.

