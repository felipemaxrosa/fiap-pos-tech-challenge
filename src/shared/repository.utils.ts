export class RepositoryUtils {
   // The ids' values are coming as string from the request, whereas they should be numbers.
   static convertIdtoNumberTypeIfPresent(attributes: any, fieldWithIdContent: string): any {
      if (!attributes[fieldWithIdContent]) return attributes;
      return { ...attributes, [fieldWithIdContent]: Number(attributes[fieldWithIdContent]) };
   }
}
