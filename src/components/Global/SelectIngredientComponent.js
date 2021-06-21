import React, { useState, useEffect } from "react";

import { Grid, Button, Typography } from "@material-ui/core";

import { EntityList } from "../Global/EntityList";
import { Thumbnail } from "../Global/Thumbnail";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserMultiSelectInputComponent } from "../Global/UserMultiSelectInputComponent";

import { Ingredient, IngredientCategory } from "../../models";

function SelectIngredientComponent({ Api, ingredients, selectIngredient }) {
    const [categories, setCategories] = useState([new IngredientCategory()]);
    if (categories.length === 1 && categories[0].CountId === -1)
    {
        categories.pop();
    }

    useEffect(() => {
        Api.IngredientCategories.GetAll().then((categories) => {
            if (categories instanceof String) { return; }
        
            setCategories(categories);
        });
    }, [Api.IngredientCategories]);

    const [filterOptions, setFilterOptions] = useState({ name: '', categories: [] });

    const filter = (ingredient = new Ingredient()) => {
        return (
            (filterOptions.name?.length > 0 ? ingredient.Name.toLowerCase().indexOf(filterOptions.name.toLowerCase()) > -1 : true) &&
            (filterOptions.categories?.length > 0 ?
                ingredient.Categories.filter(c => {
                    return filterOptions.categories.filter(x => {
                        return x === c.CountId;
                    }).length > 0;
                }).length > 0
            : true)
        );
    };

    return (
        <>
            <Grid container style={{ borderBottom: 'solid 1px', overflow: 'auto', paddingLeft: "10px" }}>
                <Grid container direction="row" style={{ marginBottom: '8px', display: 'flex', alignContent: 'center' }}><Typography variant="h5">Filters</Typography></Grid>
                <Grid container direction="column" item xs={6} style={{ padding: '3px', display: 'flex', alignContent: 'center' }}>
                    <Grid container direction="row" style={{ marginRight: '5px', display: 'flex', alignContent: 'center' }}>Search:</Grid>
                    <Grid container direction="row" style={{ display: 'flex', alignContent: 'center' }}>
                        <UserInputComponent
                            defaultValue={filterOptions.name}
                            name="search by name"
                            onChange={(value) => setFilterOptions(filterOptions => { return { ...filterOptions, ...{ name: value } }; })}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="column" item xs={6} style={{ padding: '3px', display: 'flex', alignContent: 'center' }}>
                    <Grid container direction="row" style={{ marginRight: '5px', display: 'flex', alignContent: 'center' }}>Categories:</Grid>
                    <Grid container direction="row" style={{ display: 'flex', alignContent: 'center' }}>
                        <UserMultiSelectInputComponent
                            name="select categories"
                            defaultValue={filterOptions.categories}
                            options={categories.map(category => { return { name: category.Name, value: category.CountId }; })}
                            onChange={(values) => setFilterOptions(filterOptions => { return { ...filterOptions, ...{ categories: values } }; })}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid style={{ paddingLeft: "10px" }}>
                <Typography variant="h3">Select an ingredient</Typography>
                <EntityList
                    columns={[
                        { id: 'image', label: '', minWidth: 50 },
                        { id: 'name', label: 'Name', minWidth: 100 },
                        { id: 'unitTypes', label: 'Available Types', minWidth: 125 },
                        { id: 'categories', label: 'Categories', minWidth: 125 },
                        { id: 'select', label: 'Choose', minWidth: 100 },
                    ]}
                    rows={ingredients.filter(i => filter(i)).map(ingredient => {
                        return {
                            id: ingredient.Id,
                            image: <Thumbnail source={ingredient.ImageLocation} size={50} />,
                            name: ingredient.Name,
                            unitTypes: ingredient.UnitTypes.map((unitType, index) => { if (index > 0) return ", " + unitType.Name; else return unitType.Name; }),
                            categories: ingredient.Categories.map((category, index) => { if (index > 0) return ", " + category.Name; else return category.Name; }),
                            select: <Button onClick={() => selectIngredient(ingredient)} style={{ color: 'forestgreen' }}>Select</Button>,
                            onClick: () => selectIngredient(ingredient)
                        };
                    })}
                />
            </Grid>
        </>
    );
};

export { SelectIngredientComponent };