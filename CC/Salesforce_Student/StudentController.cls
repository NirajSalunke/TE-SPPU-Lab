public class StudentController {

    public Student__c student { get; set; }
    public List<Student__c> studentList { get; set; }
    public Id selectedStudentId { get; set; }

    public StudentController() {
        student = new Student__c();
        loadStudents();
    }

    public void loadStudents() {
        studentList = [
            SELECT Id, Name, Roll_No__c, Class__c, Mobile_No__c
            FROM Student__c
            ORDER BY CreatedDate DESC
        ];
    }

    public PageReference saveStudent() {
        try {
            upsert student;
            ApexPages.addMessage(new ApexPages.Message(
                ApexPages.Severity.CONFIRM, 'Student record saved successfully!'
            ));
            student = new Student__c();
            loadStudents();
        } catch (Exception e) {
            ApexPages.addMessage(new ApexPages.Message(
                ApexPages.Severity.ERROR, 'Error: ' + e.getMessage()
            ));
        }
        return null;
    }

    public void editStudent() {
        student = [
            SELECT Id, Name, Roll_No__c, Class__c, Mobile_No__c
            FROM Student__c
            WHERE Id = :selectedStudentId
            LIMIT 1
        ];
    }

    public void deleteStudent() {
        try {
            Student__c toDelete = [
                SELECT Id FROM Student__c
                WHERE Id = :selectedStudentId
                LIMIT 1
            ];
            delete toDelete;
            loadStudents();
            ApexPages.addMessage(new ApexPages.Message(
                ApexPages.Severity.CONFIRM, 'Student record deleted successfully!'
            ));
        } catch (Exception e) {
            ApexPages.addMessage(new ApexPages.Message(
                ApexPages.Severity.ERROR, 'Error: ' + e.getMessage()
            ));
        }
    }

    public void newStudent() {
        student = new Student__c();
    }
}