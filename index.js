const parser = require('@babel/parser');
const {default:generator} = require('@babel/generator');
const t = require('@babel/types');
const {default:traverse} = require('@babel/traverse');
// const {default:template} = require('@babel/template')
// const path = require('path');
const fs = require('fs');

function writeFile(data, fileName='./clk.main.bundle.js', flag='w'){
    let f = fs.openSync(fileName, flag);
    fs.writeSync(f, data);
    fs.closeSync(f);
}


let code = fs.readFileSync('./main.bundle.js',{
    encoding:'utf-8'
});

let ast = parser.parse(code);

function replaceExport(ast){
    ast.traverse({
        ExpressionStatement(path){
            let exp = path.get('expression');
            if(exp.isAssignmentExpression()){
                let expL = exp.get('left');
                if(expL.isMemberExpression() && expL.get('property').node.name === 'exports'){
                    let node = t.arrowFunctionExpression([],
                            t.callExpression(
                                t.memberExpression(t.identifier('Promise'),t.identifier('resolve')),
                                [
                                    t.objectExpression([
                                        t.objectProperty(t.identifier('expiresAt'),t.numericLiteral(864e13)),
                                        t.objectProperty(t.identifier('quantity'),t.memberExpression(t.identifier('Number'),t.identifier('MAX_SAFE_INTEGER'))),
                                        t.objectProperty(t.identifier('subscriber'),t.objectExpression(
                                            [
                                                t.objectProperty(t.identifier('name'), t.stringLiteral('KillWolfVlad'))
                                            ]
                                        ))
                                    ])
                                ]
                            )
                        );
                    exp.get('right').replaceWith(node);
                    // console.log(generator(exp.node).code);
                }
            }
        }
    })
}

traverse(ast,{
    // Program(path){
    //    //Entrance
    // }
    ExpressionStatement(path){
        let exp = path.get('expression')
        if(exp.isAssignmentExpression() && exp.get('right').isStringLiteral()){
            let right = exp.get('right');
            if(right.node.value === 'NORMAL'){
                right.replaceWith(t.stringLiteral('STANDALONE'))
            }
        }
    },
    VariableDeclaration(path){
        let declartions = path.get('declarations');
        for (let i = 0; i < declartions.length; i++) {
            const d = declartions[i];
            if(d.get('id').node.name === 'assembleBlocks'){
                let parent = path.parentPath.parentPath;
                replaceExport(parent);
            }
        }
    }
})

writeFile(generator(ast,{
    compact:true
}).code);