import prisma from "@/lib/prisma";

export async function GET() {
    const patients = await prisma.patient.findMany();
    return Response.json(patients);
}

export async function POST(request: Request) {
    try {
        const errors: string[] = [];
        const body = await request.json();
        
        const{
  firstName,
  lastName,
  dateOfBirth, 
  gender,
  phoneNumber,
  email,  
  streetAddress,
  city,
  state,
  zipCode,
  country,
  emergencyContactName,
  emergencyContactPhone,
  emergencyContactRelationship,
  bloodType,
  allergies,
  currentMedications,
  medicalConditions,
  pastSurgeries,
  insuranceProvider,
  policyNumber,
  groupNumber,
  preferredDate,
  preferredTime,
  reasonForVisit,
  passportNumber, 
  nationality,
  arrivalDate,
  departureDate,
  hotelPreference,
  cardholderName,
  cardNumber,
  expirationDate,
  cvv,
  billingAddress,
  

       
    } = body

    const isString = (v: unknown): v is string => typeof v === "string";
    const hasValue = (v: unknown) => isString(v) && v.trim().length > 0;
    const digitsOnly = (v: string) => v.replace(/\D/g, "");

    
    if (!hasValue(email)) errors.push("Email is required.");

    if (hasValue(firstName) && !/^[A-Za-z][A-Za-z\s'-.]{0,49}$/.test(firstName.trim())) {
      errors.push("First name contains invalid characters.");
    }
    if (hasValue(lastName) && !/^[A-Za-z][A-Za-z\s'-.]{0,49}$/.test(lastName.trim())) {
      errors.push("Last name contains invalid characters.");
    }

    const dobDate = hasValue(dateOfBirth)
      ? new Date(`${dateOfBirth.trim()}T00:00:00.000Z`)
      : undefined

    if (hasValue(dateOfBirth) && !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth.trim())) {
      errors.push("Date of birth must be YYYY-MM-DD.");
    } 
    
    

    if (hasValue(email) && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      errors.push("Email format is invalid.");
    }

    if (hasValue(phoneNumber)) {
      const d = digitsOnly(phoneNumber);
      if (d.length < 10 || d.length > 15) {
        errors.push("Phone number must contain 10 to 15 digits.");
      }
    }

    if (zipCode != null && !isString(zipCode)) errors.push("Zip code must be text.");
    if (hasValue(zipCode) && !/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
      errors.push("Zip code must be 12345 or 12345-6789.");
    }

    if (emergencyContactPhone != null && !isString(emergencyContactPhone)) {
      errors.push("Emergency contact phone must be text.");
    }
    if (hasValue(emergencyContactPhone)) {
      const d = digitsOnly(emergencyContactPhone);
      if (d.length < 10 || d.length > 15) {
        errors.push("Emergency contact phone must contain 10 to 15 digits.");
      }
    }

    if (bloodType != null && !isString(bloodType)) errors.push("Blood type must be text.");
    if (hasValue(bloodType)) {
      const bt = bloodType.trim().toUpperCase();
      if (!["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bt)) {
        errors.push("Blood type must be one of A+, A-, B+, B-, AB+, AB-, O+, O-.");
      }
    }

    if (preferredTime != null && !isString(preferredTime)) errors.push("Preferred time must be text.");
    if (hasValue(preferredTime) && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(preferredTime.trim())) {
      errors.push("Preferred time must be HH:MM (24-hour).");
    }

    if (cardNumber != null && !isString(cardNumber)) errors.push("Card number must be text.");
    if (hasValue(cardNumber) && !/^\d{12,19}$/.test(digitsOnly(cardNumber))) {
      errors.push("Card number must be 12 to 19 digits.");
    }

    if (cvv != null && !isString(cvv)) errors.push("CVV must be text.");
    if (hasValue(cvv) && !/^\d{3,4}$/.test(cvv.trim())) {
      errors.push("CVV must be 3 or 4 digits.");
    }
    if (await prisma.patient.findUnique({ where: { email } })) {
      errors.push("");
    }

// FINAL CHECK
if (errors.length > 0) {
  return new Response(errors.join(", "), { status: 400 });
}
else {
    const createpatient = await prisma.patient.create({
    data: {
        firstName,
        lastName,
        dateOfBirth: dobDate, 
        gender,
        phoneNumber,
        email,    
        streetAddress,
        city,
        state,
        zipCode,  
        country,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelationship,
        bloodType,
        allergies,
        currentMedications,
        medicalConditions,
        pastSurgeries,
        insuranceProvider,
        policyNumber,
        groupNumber,
        preferredDate,
        preferredTime,
        reasonForVisit,
        passportNumber,
        nationality,
        arrivalDate, 
        departureDate,
        hotelPreference,
        cardholderName,
        cardNumber,
        expirationDate,
        cvv,
        billingAddress



    }
    });
    return new Response(JSON.stringify(createpatient));
}
    }
    catch (error) {
        return new Response("Error creating patient: " + error, { status: 500 });
    }
}



export async function PATCH(request: Request) {
    const body = await request.json();
    const{email, ...updateData} = body;
    if (typeof updateData.dateOfBirth === "string") {
  const dob = updateData.dateOfBirth.trim();

  if (dob === "") {
    // if blank, either remove it from update or clear it
    delete updateData.dateOfBirth; // keeps existing DB value
    // or: updateData.dateOfBirth = null; // clears DB value
  } else {
    updateData.dateOfBirth = new Date(`${dob}T00:00:00.000Z`);
  }

}
    const update = await prisma.patient.update({
        where: { email: email },
        data: updateData,
    });
    return new Response(JSON.stringify(update));


}
