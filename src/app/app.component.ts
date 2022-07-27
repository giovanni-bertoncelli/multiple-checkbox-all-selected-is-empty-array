import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

interface Attribute {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  form: FormGroup;
  title = 'CodeSandbox';
  attributes: Attribute[] = [
    {
      id: 1,
      name: 'a',
    },
    {
      id: 2,
      name: 'b',
    },
    {
      id: 3,
      name: 'c',
    },
    {
      id: 4,
      name: 'd',
    },
  ];

  get attributesAllSelected(): boolean {
    return !this.form.value.attributeIds.length;
  }

  isAttributeSelected(attributeId: number): boolean {
    return (
      this.attributesAllSelected ||
      this.form.value.attributeIds.includes(attributeId)
    );
  }

  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      attributeIds: [[]],
    });
  }

  /**
   * This handles the click on a checkbox:
   * - If all attributes are checked (empty array) => prevent uncheck and set
   * only the selected attribute checked
   * - If the item will be checked:
   *    - If it's the last one set empty array => all selected
   *    - Otherwise select only the item
   * - If the item will be unchecked:
   *    - If it's the last item prevent uncheck and select all
   *    - Otherwise remove the item
   */
  filterAttribute(attributeId: number, event: any, attributes: Attribute[]) {
    const value = event.target.checked;
    const { attributeIds: currentFilter } = this.form.value;
    let resultAttributeIds = [...currentFilter];

    // 1. all selected: select only that attribute, going to be unchecked
    if (!currentFilter.length) {
      // should not be set to false
      event.preventDefault();
      resultAttributeIds = [attributeId];
    }
    // 2. item going to be checked
    else if (value) {
      if (currentFilter.length === attributes.length - 1) {
        // last item selected => select all
        resultAttributeIds = [];
      } else {
        // push single item
        resultAttributeIds.push(attributeId);
      }
    }
    // 3. item going to be unchecked => should remove
    else if (currentFilter.length === 1) {
      // should not be set to false
      event.preventDefault();
      // removing last item => select all
      resultAttributeIds = [];
    } else {
      // remove single item
      resultAttributeIds.splice(resultAttributeIds.indexOf(attributeId), 1);
    }
    this.form.patchValue({ attributeIds: resultAttributeIds });
  }

  toggleAllAttributes(nextValue: boolean, attributes: Attribute[]) {
    if (!nextValue) {
      // was unchecked: filter only first attribute
      this.form.patchValue({ attributeIds: [attributes[0].id] });
    } else {
      // was checked: all attributes
      this.form.patchValue({ attributeIds: [] });
    }
  }
}
