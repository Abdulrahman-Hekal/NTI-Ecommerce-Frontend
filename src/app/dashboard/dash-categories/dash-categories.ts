import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategory, ISubCategory } from '../../core/models/category.model';
import { CategoriesService } from '../../core/services/categoriesService/categories.service';
import { SubCategoriesService } from '../../core/services/subCategoriesService/sub-categories.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dash-categories',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dash-categories.html',
  styleUrl: './dash-categories.css',
})
export class DashCategories implements OnInit {
  // Properties
  categoriesList = signal<ICategory[]>([]);
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  subCategoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  updateCategoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  targetCategory = signal<ICategory | ISubCategory>({} as ICategory);
  isSuccess = signal(false);
  isError = signal(false);
  alertMessage = signal('');
  // Injections
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _subCategoriesService = inject(SubCategoriesService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
    this.getCategories();
  }

  // Methods
  // Get
  getCategories() {
    this._categoriesService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.categoriesList.set(res.data);
        },
        error: (res) => {
          this.alertMessage.set(res.error.message);
          this.isError.set(true);
          setTimeout(() => {
            this.isError.set(false);
          }, 2500);
        },
      });
  }

  // Add
  addCategory() {
    if (this.categoryForm.valid) {
      this._categoriesService
        .addCategory(this.categoryForm.value.name as string)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this.getCategories();
            this.categoryForm.reset();
            this.alertMessage.set(res.message);
            this.isSuccess.set(true);
            setTimeout(() => {
              this.isSuccess.set(false);
            }, 2500);
          },
          error: (res) => {
            this.alertMessage.set(res.error.message);
            this.isError.set(true);
            setTimeout(() => {
              this.isError.set(false);
            }, 2500);
          },
        });
    } else {
      this.alertMessage.set('The Form is not Valid');
      this.isError.set(true);
      setTimeout(() => {
        this.isError.set(false);
      }, 2500);
    }
  }
  addSubCategory() {
    if (this.subCategoryForm.valid) {
      const body = {
        name: this.subCategoryForm.value.name as string,
        parentId: this.targetCategory()._id,
      };
      this._subCategoriesService
        .addSubCategory(body)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this.getCategories();
            this.subCategoryForm.reset();
            this.alertMessage.set(res.message);
            this.isSuccess.set(true);
            setTimeout(() => {
              this.isSuccess.set(false);
            }, 2500);
          },
          error: (res) => {
            this.alertMessage.set(res.error.message);
            this.isError.set(true);
            setTimeout(() => {
              this.isError.set(false);
            }, 2500);
          },
        });
    } else {
      this.alertMessage.set('The Form is not Valid');
      this.isError.set(true);
      setTimeout(() => {
        this.isError.set(false);
      }, 2500);
    }
  }

  // Update
  updateCategory(cat: ICategory) {
    this.targetCategory.set(cat);
    this.updateCategoryForm.patchValue({
      name: this.targetCategory().name,
    });
  }
  updateSubCategory(cat: ISubCategory) {
    this.targetCategory.set(cat);
    this.subCategoryForm.patchValue({
      name: this.targetCategory().name,
    });
  }
  confirmUpdateCategory() {
    if (this.updateCategoryForm.valid) {
      this._categoriesService
        .updateCategory(this.targetCategory()._id, this.updateCategoryForm.value.name as string)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this.getCategories();
            this.alertMessage.set(res.message);
            this.isSuccess.set(true);
            setTimeout(() => {
              this.isSuccess.set(false);
            }, 2500);
          },
          error: (res) => {
            this.alertMessage.set(res.error.message);
            this.isError.set(true);
            setTimeout(() => {
              this.isError.set(false);
            }, 2500);
          },
        });
    } else {
      this.alertMessage.set('The Form is not Valid');
      this.isError.set(true);
      setTimeout(() => {
        this.isError.set(false);
      }, 2500);
    }
  }
  confirmUpdateSubCategory() {
    if (this.subCategoryForm.valid) {
      this._subCategoriesService
        .updateSubCategory(this.targetCategory()._id, this.subCategoryForm.value.name as string)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this.getCategories();
            this.alertMessage.set(res.message);
            this.isSuccess.set(true);
            setTimeout(() => {
              this.isSuccess.set(false);
            }, 2500);
          },
          error: (res) => {
            this.alertMessage.set(res.error.message);
            this.isError.set(true);
            setTimeout(() => {
              this.isError.set(false);
            }, 2500);
          },
        });
    } else {
      this.alertMessage.set('The Form is not Valid');
      this.isError.set(true);
      setTimeout(() => {
        this.isError.set(false);
      }, 2500);
    }
  }

  // Delete
  setTarget(cat: ICategory | ISubCategory) {
    this.targetCategory.set(cat);
  }
  confirmDeleteCategory() {
    this._categoriesService
      .deleteCategory(this.targetCategory()._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.getCategories();
          this.alertMessage.set(res.message);
          this.isSuccess.set(true);
          setTimeout(() => {
            this.isSuccess.set(false);
          }, 2500);
        },
        error: (res) => {
          this.alertMessage.set(res.error.message);
          this.isError.set(true);
          setTimeout(() => {
            this.isError.set(false);
          }, 2500);
        },
      });
  }
  confirmDeleteSubCategory() {
    this._subCategoriesService
      .deleteSubCategory(this.targetCategory()._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.getCategories();
          this.alertMessage.set(res.message);
          this.isSuccess.set(true);
          setTimeout(() => {
            this.isSuccess.set(false);
          }, 2500);
        },
        error: (res) => {
          this.alertMessage.set(res.error.message);
          this.isError.set(true);
          setTimeout(() => {
            this.isError.set(false);
          }, 2500);
        },
      });
  }
}
