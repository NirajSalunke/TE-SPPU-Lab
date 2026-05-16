# Salesforce Apex + Visualforce: Student Record Management

## Assignment Overview
Build a Salesforce application using:
- A **Custom Object** (`Student__c`) to store student data
- An **Apex Controller** for business logic (CRUD operations)
- A **Visualforce Page** for the user interface

---

## Step 1: Set Up a Salesforce Developer Org

1. Go to [developer.salesforce.com](https://developer.salesforce.com/signup) and sign up for a **free Developer Org**.
2. Log in at [login.salesforce.com](https://login.salesforce.com).
3. Click the **gear icon (⚙️)** in the top-right → Select **Setup**.

---

## Step 2: Create the Custom Object (`Student__c`)

1. In Setup, search for **Object Manager** in the Quick Find box → Click it.
2. Click **Create** → **Custom Object**.
3. Fill in the details:
   - **Label**: `Student`
   - **Plural Label**: `Students`
   - **Object Name**: `Student` *(auto-fills as `Student__c`)*
   - **Record Name**: `Student Name` (Data Type: Text)
4. Click **Save**.

---

## Step 3: Add Custom Fields to `Student__c`

Go to **Object Manager → Student → Fields & Relationships → New** and add these fields:

| Field Label   | API Name            | Data Type     | Length |
|---------------|---------------------|---------------|--------|
| Roll No       | `Roll_No__c`        | Number        | 10, 0  |
| Class         | `Class__c`          | Text          | 50     |
| Mobile No     | `Mobile_No__c`      | Phone         | —      |

> **Note**: `Name` field already exists as the standard field on the object — map it to Student Name.

For each field:
1. Click **New** → Choose data type → Click **Next**.
2. Enter the Field Label and API Name → Click **Next** → **Next** → **Save**.

---

## Step 4: Write the Apex Controller Class

1. In Setup, search **Apex Classes** → Click **New**.
2. Paste the following code:

```apex
public class StudentController {

    public Student__c student { get; set; }
    public List<Student__c> studentList { get; set; }
    public Id selectedStudentId { get; set; }

    public StudentController() {
        student = new Student__c();
        loadStudents();
    }

    // Load all student records
    public void loadStudents() {
        studentList = [
            SELECT Id, Name, Roll_No__c, Class__c, Mobile_No__c
            FROM Student__c
            ORDER BY CreatedDate DESC
        ];
    }

    // Insert or Update student record
    public PageReference saveStudent() {
        try {
            upsert student;
            ApexPages.addMessage(new ApexPages.Message(
                ApexPages.Severity.CONFIRM, 'Student record saved successfully!'
            ));
            student = new Student__c(); // Reset form
            loadStudents();
        } catch (Exception e) {
            ApexPages.addMessage(new ApexPages.Message(
                ApexPages.Severity.ERROR, 'Error: ' + e.getMessage()
            ));
        }
        return null;
    }

    // Load selected record into the form for editing
    public void editStudent() {
        selectedStudentId = ApexPages.currentPage().getParameters().get('studentId');
        student = [
            SELECT Id, Name, Roll_No__c, Class__c, Mobile_No__c
            FROM Student__c
            WHERE Id = :selectedStudentId
            LIMIT 1
        ];
    }

    // Delete a student record
    public void deleteStudent() {
        selectedStudentId = ApexPages.currentPage().getParameters().get('studentId');
        Student__c toDelete = [SELECT Id FROM Student__c WHERE Id = :selectedStudentId LIMIT 1];
        delete toDelete;
        loadStudents();
        ApexPages.addMessage(new ApexPages.Message(
            ApexPages.Severity.CONFIRM, 'Student record deleted successfully!'
        ));
    }

    // Reset/clear the form
    public void newStudent() {
        student = new Student__c();
    }
}
```

3. Click **Save**.

---

## Step 5: Create the Visualforce Page

1. In Setup, search **Visualforce Pages** → Click **New**.
2. **Label**: `StudentManager`, **Name**: `StudentManager`
3. Paste the following markup:

```xml
<apex:page controller="StudentController" showHeader="true" sidebar="false">
    <apex:form >
        <apex:pageMessages />

        <!-- Student Form Panel -->
        <apex:pageBlock title="Student Record Management">
            <apex:pageBlockSection title="Student Details" columns="2">

                <apex:inputField value="{!student.Name}" label="Student Name" required="true"/>
                <apex:inputField value="{!student.Roll_No__c}" label="Roll No" required="true"/>
                <apex:inputField value="{!student.Class__c}" label="Class" required="true"/>
                <apex:inputField value="{!student.Mobile_No__c}" label="Mobile No" required="true"/>

            </apex:pageBlockSection>

            <apex:pageBlockButtons location="bottom">
                <apex:commandButton value="Save" action="{!saveStudent}" rerender="studentTable,msgs"/>
                <apex:commandButton value="New" action="{!newStudent}" rerender="formBlock" immediate="true"/>
            </apex:pageBlockButtons>
        </apex:pageBlock>

        <!-- Student List Table -->
        <apex:pageBlock title="Student List" id="studentTable">
            <apex:pageBlockTable value="{!studentList}" var="s">

                <apex:column headerValue="Student Name">
                    <apex:outputText value="{!s.Name}"/>
                </apex:column>

                <apex:column headerValue="Roll No">
                    <apex:outputText value="{!s.Roll_No__c}"/>
                </apex:column>

                <apex:column headerValue="Class">
                    <apex:outputText value="{!s.Class__c}"/>
                </apex:column>

                <apex:column headerValue="Mobile No">
                    <apex:outputText value="{!s.Mobile_No__c}"/>
                </apex:column>

                <apex:column headerValue="Actions">
                    <apex:commandLink value="Edit" action="{!editStudent}" rerender="formBlock">
                        <apex:param name="studentId" value="{!s.Id}" assignTo="{!selectedStudentId}"/>
                    </apex:commandLink>
                    &nbsp;|&nbsp;
                    <apex:commandLink value="Delete" action="{!deleteStudent}" 
                        onclick="return confirm('Are you sure you want to delete this record?');"
                        rerender="studentTable">
                        <apex:param name="studentId" value="{!s.Id}" assignTo="{!selectedStudentId}"/>
                    </apex:commandLink>
                </apex:column>

            </apex:pageBlockTable>
        </apex:pageBlock>

    </apex:form>
</apex:page>
```

4. Click **Save**.

---

## Step 6: Preview & Test the Page

1. After saving, click **Preview** button on the Visualforce Page detail screen.
2. Or navigate to: `https://your-org-domain.salesforce.com/apex/StudentManager`
3. Test the following operations:

| Operation | How to Test |
|-----------|-------------|
| **Create** | Fill in Name, Roll No, Class, Mobile No → Click Save |
| **Read**   | All saved records appear in the Student List table |
| **Update** | Click **Edit** next to a record → Modify fields → Click Save |
| **Delete** | Click **Delete** next to a record → Confirm the dialog |

---

## Step 7: (Optional) Add Tab for Easy Navigation

1. Go to **Setup → Tabs → New (Custom Object Tab)**.
2. Select **Student** object → Choose a tab style → Click **Next → Save**.
3. The Student tab will now appear in your App navigation bar.

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│         Visualforce Page            │
│       (StudentManager.vfp)          │
│   [Form] + [Student List Table]     │
└────────────────┬────────────────────┘
                 │ calls
┌────────────────▼────────────────────┐
│         Apex Controller             │
│       (StudentController.cls)       │
│   saveStudent() / editStudent()     │
│   deleteStudent() / loadStudents()  │
└────────────────┬────────────────────┘
                 │ SOQL/DML
┌────────────────▼────────────────────┐
│         Custom Object               │
│           Student__c                │
│  Name | Roll_No__c | Class__c       │
│  Mobile_No__c                       │
└─────────────────────────────────────┘
```

---

## Key Salesforce Concepts Used

| Concept | Description |
|--------|-------------|
| **Custom Object (`__c`)** | User-defined data tables in Salesforce (like DB tables) |
| **Apex Controller** | Server-side Java-like code handling business logic |
| **DML (upsert/delete)** | Database operations on Salesforce objects |
| **SOQL** | Salesforce Object Query Language (like SQL for Salesforce) |
| **Visualforce (`apex:`)** | XML-based UI framework bound to Apex controllers |
| **`apex:pageBlock`** | Standard Salesforce-styled content container |
| **`apex:commandButton`** | Button that triggers Apex controller methods |
| **`rerender`** | Partial page refresh using Ajax (no full reload) |

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Variable does not exist: Roll_No__c` | Field API name mismatch — check exact field names in Object Manager |
| `Insufficient Access` | Enable CRUD permissions on `Student__c` for your profile |
| `Save Error on VF Page` | Make sure required fields are filled in the form |
| Object not visible in page | Check FLS (Field Level Security) for your profile |

---

*Assignment: Salesforce Apex + Visualforce Student Record Management App*  
*Technology: Salesforce Apex, Visualforce, SOQL, DML*
