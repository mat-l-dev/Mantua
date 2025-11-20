// import { SBProduct } from "@/services/products/types";
// import { SBCategory } from "@/services/categories/types";
// import { SBCoupon } from "@/services/coupons/types";
// import { SBCustomer } from "@/services/customers/types";
// import { SBStaff } from "@/services/staff/types";

// type ValidationErrorsResponse = {
//   validationErrors: Record<string, string>; // Errores de validación por campo
// };

// type DbErrorResponse = {
//   dbError: string; // Error de base de datos
// };

// type SuccessResponse = {
//   success: boolean; // Indica si la operación fue exitosa
// };

// export type ServerActionResponse = DbErrorResponse | SuccessResponse;

// export type VServerActionResponse =
//   | ValidationErrorsResponse
//   | ServerActionResponse;

// export type ProductServerActionResponse =
//   | ValidationErrorsResponse
//   | DbErrorResponse
//   | (SuccessResponse & {
//       product: SBProduct; // Producto devuelto cuando la operación es exitosa
//     });

// export type CategoryServerActionResponse =
//   | ValidationErrorsResponse
//   | DbErrorResponse
//   | (SuccessResponse & {
//       category: SBCategory; // Categoría devuelta
//     });

// export type CouponServerActionResponse =
//   | ValidationErrorsResponse
//   | DbErrorResponse
//   | (SuccessResponse & {
//       coupon: SBCoupon; // Cupón devuelto
//     });

// export type CustomerServerActionResponse =
//   | ValidationErrorsResponse
//   | DbErrorResponse
//   | (SuccessResponse & {
//       customer: SBCustomer; // Cliente devuelto
//     });

// export type StaffServerActionResponse =
//   | ValidationErrorsResponse
//   | DbErrorResponse
//   | (SuccessResponse & {
//       staff: SBStaff; // Personal devuelto
//     });

// export type ProfileServerActionResponse =
//   | ValidationErrorsResponse
//   | DbErrorResponse
//   | SuccessResponse;
