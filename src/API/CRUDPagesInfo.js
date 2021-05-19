import { Button, Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import { ImageInputComponent } from "../components/Global/ImageInputComponent";
import { UserInputComponent } from "../components/Global/UserInputComponent";
import { UserMultiSelectInputComponent } from "../components/Global/UserMultiSelectInputComponent";
import { UserSelectInputComponent } from "../components/Global/UserSelectInputComponent";
import { PreparationStepsInputComponent } from "../components/RecipeBook/preparationStepsInputComponent";
import { RequirementsInputComponent } from "../components/RecipeBook/RequirementsInputComponent";

//import { Ingredient, IngredientCategory, Recipe, RecipeCategory, UnitType } from "../models";

function CreateIngredientEditPage(item, notEditableProps, ApiTables, onItemEdited) {
    return (
        <Grid container direction="row" style={{ padding: '15px', justifyContent: 'center' }}>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserInputComponent
                    name="Name"
                    defaultValue={item?.Name}
                    onChange={(value) => { onItemEdited({ Name: value }); }}
                />
            </Grid>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <ImageInputComponent
                    defaultValue={item?.ImageLocation}
                    onChange={(value) => { onItemEdited({ ImageLocation: value }); }}
                />
            </Grid>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserMultiSelectInputComponent
                    name="UnitTypes"
                    defaultValues={item?.UnitTypes.map(unitType => unitType.CountId)}
                    options={ApiTables.unitTypes.map(unitType => { return { name: unitType.Name, value: unitType.CountId}; })}
                    onChange={(value) => { onItemEdited({ UnitTypes: value }); }}
                />
            </Grid>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserInputComponent
                    name="Weight /Unit (Kg)"
                    defaultValue={item?.AverageWeightInKgPerUnit}
                    type="number"
                    inputProps={{
                        step: 0.00,
                        min: 0.01,
                        max: 1000.00,
                    }}
                    onChange={(value) => { onItemEdited({ AverageWeightInKgPerUnit: value }); }}
                />
            </Grid>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserInputComponent
                    name="Volume /Unit (L)"
                    defaultValue={item?.AverageVolumeInLiterPerUnit}
                    type="number"
                    inputProps={{
                        step: 0.00,
                        min: 0.01,
                        max: 1000.00,
                    }}
                    onChange={(value) => { onItemEdited({ AverageVolumeInLiterPerUnit: value }); }}
                />
            </Grid>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserMultiSelectInputComponent
                    name="Categories"
                    defaultValues={item?.Categories.map(cat => cat.CountId)}
                    options={ApiTables.ingredientCategories.map(cat => { return { name: cat.Name, value: cat.CountId}; })}
                    onChange={(value) => { onItemEdited({ Categories: value }); }}
                />
            </Grid>
        </Grid>
    );
};

function CreateIngredientCategoryEditPage(item, notEditableProps, ApiTables, onItemEdited) {
    return (
        <Grid container direction="row" style={{ padding: '15px', justifyContent: 'center' }}>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserInputComponent
                    name="Name"
                    defaultValue={item?.Name}
                    onChange={(value) => { onItemEdited({ Name: value }); }}
                />
            </Grid>
        </Grid>
    );
};

function CreateUnitTypeEditPage(item, notEditableProps, ApiTables, onItemEdited) {
    return (
        <Grid container direction="row" style={{ padding: '15px', justifyContent: 'center' }}>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserInputComponent
                    name="Name"
                    defaultValue={item?.Name}
                    onChange={(value) => { onItemEdited({ Name: value }); }}
                />
            </Grid>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserSelectInputComponent
                    name="AllowDecimals"
                    defaultValue={item?.AllowDecimals}
                    options={[{ name: 'Decimals', value: true }, { name: 'Integers', value: false }]}
                    onChange={(value) => { onItemEdited({ AllowDecimals: value }); }}
                />
            </Grid>
        </Grid>
    );
};

function CreateRecipeEditPage(item, notEditableProps, ApiTables, onItemEdited, Api, { preparationStepsOpen, setPreparationStepsOpen, requirementsListOpen, setRequirementsListOpen, preparationStepsCount = 0, requirementsCount = 0 }) {
    
    return (
        <Grid container direction="row" style={{ padding: '15px', justifyContent: 'center' }}>
            <Dialog keepMounted open={preparationStepsOpen ?? false} onClose={() => setPreparationStepsOpen(false)}>
                <DialogTitle>Preparation Steps</DialogTitle>
                <DialogContent>
                    <PreparationStepsInputComponent
                        name="Preparation Step"
                        defaultValue={item?.PreparationSteps}
                        onChange={(value) => { onItemEdited({ PreparationSteps: value }); }}
                    />
                </DialogContent>
            </Dialog>
            <Dialog keepMounted open={requirementsListOpen ?? false} onClose={() => setRequirementsListOpen(false)}>
                <DialogTitle>RequirementsList</DialogTitle>
                <DialogContent>
                    <RequirementsInputComponent
                        Api={Api}
                        defaultValues={item?.RequirementsList}
                        parentRecipe={item}
                        onChange={(value) => { onItemEdited({ RequirementsList: value }); }}
                    />
                </DialogContent>
            </Dialog>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserInputComponent
                    name="Name"
                    defaultValue={item?.Name}
                    onChange={(value) => { onItemEdited({ Name: value }); }}
                />
            </Grid>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserInputComponent
                    name="Description"
                    defaultValue={item?.Description}
                    onChange={(value) => { onItemEdited({ Description: value }); }}
                />
            </Grid>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <ImageInputComponent
                    defaultValue={item?.ImageLocation}
                    onChange={(value) => { onItemEdited({ ImageLocation: value }); }}
                />
            </Grid>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserInputComponent
                    name="Tutorial Video"
                    defaultValue={item?.VideoTutorialLink}
                    onChange={(value) => { onItemEdited({ VideoTutorialLink: value }); }}
                />
            </Grid>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <Button variant="outlined" onClick={() => setPreparationStepsOpen(true)}>
                    {preparationStepsCount} Steps
                </Button>
            </Grid>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <Button variant="outlined" onClick={() => setRequirementsListOpen(true)}>
                    {requirementsCount} Requirements
                </Button>
            </Grid>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserSelectInputComponent
                    Name={"Public?"}
                    defaultValue={item?.IsPublic}
                    options={[
                        { name: "Public", value: true },
                        { name: "Private", value: false },
                    ]}
                    onChange={(value) => { onItemEdited({ IsPublic: value }) }}
                />
            </Grid>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserMultiSelectInputComponent
                    name="Categories"
                    defaultValues={item?.Categories.map(cat => cat.CountId)}
                    options={ApiTables.recipeCategories.map(cat => { return { name: cat.Name, value: cat.CountId}; })}
                    onChange={(value) => { onItemEdited({ Categories: value }); }}
                />
            </Grid>
        </Grid>
    );
};

function CreateRecipeCategoryEditPage(item, notEditableProps, ApiTables, onItemEdited) {
    return (
        <Grid container direction="row" style={{ padding: '15px', justifyContent: 'center' }}>
            <Grid container direction="row" style={{ marginTop: '15px', justifyContent: 'center'  }}>
                <UserInputComponent
                    name="Name"
                    defaultValue={item?.Name}
                    onChange={(value) => { onItemEdited({ Name: value }); }}
                />
            </Grid>
        </Grid>
    );
};

function CreateEditPage(item, tableName, notEditableProps, ApiTables, onItemEdited, Api, additionals) {
    switch (tableName) {
        case "Ingredients":
            return CreateIngredientEditPage(item, notEditableProps, ApiTables, onItemEdited);

        case "IngredientCategories":
            return CreateIngredientCategoryEditPage(item, notEditableProps, ApiTables, onItemEdited);

        case "UnitTypes":
            return CreateUnitTypeEditPage(item, notEditableProps, ApiTables, onItemEdited);

        case "Recipes":
            return CreateRecipeEditPage(item, notEditableProps, ApiTables, onItemEdited, Api, additionals);

        case "RecipeCategories":
            return CreateRecipeCategoryEditPage(item, notEditableProps, ApiTables, onItemEdited);

        default:
            return (
                <></>
            );
    };
};

function generateCRUDInfo(tableName, displayName, notEditableProps, context) {
    context[tableName] = {
        DisplayName: displayName,
        getEditPage: (item, ApiTables, onItemEdited, Api, additionals) => {
            return (
                <Grid container direction="row">
                    {
                        CreateEditPage(item, tableName, notEditableProps, ApiTables, onItemEdited, Api, additionals)
                    }
                </Grid>
            );
        },
    };
};

class CRUDPagesInformation {
    constructor() {
        this.Pages = {};

        generateCRUDInfo('Ingredients', 'Ingredients', ["CountId", "Id"], this.Pages);

        generateCRUDInfo('IngredientCategories', 'Ingredient Categories', ["CountId"], this.Pages);

        generateCRUDInfo('UnitTypes', 'Unit Types',["CountId"], this.Pages);

        generateCRUDInfo('Recipes', 'Recipes', ["CountId", "Id", "User", "UserId"], this.Pages);

        generateCRUDInfo('RecipeCategories', 'Recipe Categories', ["CountId"], this.Pages);
    };

    Pages = {};
};

const CRUDPagesInfo = new CRUDPagesInformation();

export default CRUDPagesInfo;