/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export function toCamelCaseUsers(users: any[]): any[] {
  return users.map((user) => ({
    id: user.id,
    userName: user.user_name,
    userSurname: user.user_surname,
    email: user.email,
    phoneNumber: user.phone_number,
    role: user.role,
    creationDate: user.creation_date,
    doctor: user.doctor
      ? {
          id: user.doctor.id,
          userId: user.doctor.user_id,
          specialization: user.doctor.specialization,
          licenseNumber: user.doctor.license_number,
        }
      : undefined,
    administration: user.administration
      ? {
          id: user.administration.id,
          userId: user.administration.user_id,
          permissions: user.administration.permissions,
        }
      : undefined,
  }));
}
