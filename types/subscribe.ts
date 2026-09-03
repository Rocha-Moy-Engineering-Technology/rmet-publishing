export interface SubscribeSettings {
  /** The provider's form-post address, an absolute https address. */
  readonly action: string;
  /** The field name the provider reads the email address under. */
  readonly emailField: string;
}
