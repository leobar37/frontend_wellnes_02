import { tap, pluck } from 'rxjs/operators';
import { Icategorie, IcategorieView } from './model.categorie';
import { Injectable } from '@angular/core';

import { gql, Apollo, QueryRef } from 'apollo-angular';
import { CATEGORIE_FRAGMENT } from '@fragments/categorie';

import { Observable } from 'rxjs';
const CREATE_CATEGORIE = gql`
  ${CATEGORIE_FRAGMENT}
  mutation createCategorie($categorie: InputCategorie!) {
    createCategorie(categorie: $categorie) {
      ...categorieFragment
    }
  }
`;

const EDIT_CATEGORIE = gql`
  ${CATEGORIE_FRAGMENT}
  mutation editCategorie($categorie: InputCategorie!, $id: ID!) {
    editCategory(categorie: $categorie, id: $id) {
      ...categorieFragment
    }
  }
`;

const ALL_CATEGORIEE = gql`
  ${CATEGORIE_FRAGMENT}
  query getCategorie {
    categories {
      ...categorieFragment
    }
  }
`;

@Injectable()
export class CategorieService {
  private refCategories: QueryRef<{ categories: Icategorie[] }>;
  constructor(private apollo: Apollo) {
    console.log('initialize service');

    this.refCategories = this.apollo.watchQuery({ query: ALL_CATEGORIEE });
  }

  public getCategories() {
    return this.refCategories.valueChanges.pipe(pluck('data', 'categories'));
  }

  private refetchCategories() {
    this.refCategories.refetch();
  }
  public createCategorie(categorie: Icategorie): Observable<Icategorie> {
    return this.apollo
      .mutate({
        mutation: CREATE_CATEGORIE,
        variables: {
          categorie,
        },
      })
      .pipe(
        tap(() => this.refetchCategories()),
        pluck('data', 'createCategorie')
      );
  }

  public editCategorie(id: number, categorie: Icategorie) {
    return this.apollo
      .mutate({
        mutation: EDIT_CATEGORIE,
        variables: {
          id,
          categorie,
        },
      })
      .pipe(tap(console.log));
  }
}
