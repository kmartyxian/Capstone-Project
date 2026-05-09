export default function PatientLists({patients }: {patients: any[]}) {    
     return(
    <div>
        {patients.map((patient: any) => (
       <div key={patient.id}>
        {patient.name} - {patient.email} - {patient.phoneNumber}
        </div>
        ))}
    </div>
    )
}
