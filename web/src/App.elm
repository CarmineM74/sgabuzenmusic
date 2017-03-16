module App exposing (..)

import Debug
import Html exposing (Html, text, div, h1, i, img, node, p)
import Html.Attributes exposing (attribute, class, src)
import Html.Events exposing (onClick, on)
import Json.Decode as JD
import Material
import Material.Button as Button
import Material.Card as Card
import Material.Color as Color
import Material.Elevation as Elevation
import Material.Icon as Icon
import Material.Layout as Layout
import Material.Options as Options
import Material.Table as Table
import Material.Tooltip as Tooltip
import Material.Typography as Typo


type alias Model =
    { message : String
    , logo : String
    , mdl : Material.Model
    }


init : String -> ( Model, Cmd Msg )
init path =
    ( { message = "Guitar router is loading ..."
      , logo = path
      , mdl = Material.model
      }
    , Layout.sub0 Mdl
    )


type Msg
    = NoOp
    | Mdl (Material.Msg Msg)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Mdl msg_ ->
            Material.update Mdl msg_ model

        _ ->
            ( model, Cmd.none )


view : Model -> Html Msg
view model =
    Layout.render Mdl
        model.mdl
        [ Layout.fixedHeader ]
        { header = [ header model ]
        , drawer = []
        , tabs = ( [], [] )
        , main = [ body model ]
        }


header : Model -> Html Msg
header model =
    Layout.row [ Color.background (Color.color Color.BlueGrey Color.S700) ]
        [ Layout.title [] [ text "Guitar Router" ]
        , Layout.spacer
        , img [ src "static/sgabuzen_music_logo.jpg", class "logo" ] []
        ]


body : Model -> Html Msg
body model =
    div []
        [ tableCard model
        ]


tableCard : Model -> Html Msg
tableCard model =
    Card.view
        [ Elevation.e2
        , Options.css "width" "98%"
        , Options.css "margin-top" "10px"
        , Options.css "margin-left" "2px"
        , Options.css "margin-right" "2px"
        ]
        [ Card.title [] [ Card.head [] [ text "Presets" ] ]
        , Card.text [] [ table model ]
        , Card.actions
            [ Card.border ]
            [ Button.render Mdl
                [ 0, 0 ]
                model.mdl
                [ Button.ripple
                , Button.primary
                , Button.icon
                , Tooltip.attach Mdl [ 1, 0 ]
                ]
                [ Icon.i "update" ]
            , Tooltip.render Mdl
                [ 1, 0 ]
                model.mdl
                [ Tooltip.top ]
                [ text "Aggiorna" ]
            , Button.render Mdl
                [ 0, 1 ]
                model.mdl
                [ Button.ripple
                , Button.accent
                , Button.icon
                , Tooltip.attach Mdl [ 1, 1 ]
                ]
                [ Icon.i "add_circle" ]
            , Tooltip.render Mdl
                [ 1, 1 ]
                model.mdl
                [ Tooltip.top ]
                [ text "Nuovo preset" ]
            , Button.render Mdl
                [ 0, 2 ]
                model.mdl
                [ Button.ripple
                , Button.disabled
                , Button.icon
                , Tooltip.attach Mdl [ 1, 2 ]
                ]
                [ Icon.i "remove_circle" ]
            , Tooltip.render Mdl
                [ 1, 2 ]
                model.mdl
                [ Tooltip.top ]
                [ text "Elimina preset" ]
            ]
        ]


table : Model -> Html Msg
table model =
    Table.table
        [ Elevation.e2, Options.css "width" "98%" ]
        [ Table.thead []
            [ Table.tr []
                [ Table.th [] [ text "Id" ]
                , Table.th [] [ text "Nome" ]
                , Table.th [ Table.numeric ] [ text "Valore" ]
                , Table.th [] [ text "Abilitato" ]
                ]
            ]
        , Table.tbody []
            [ Table.tr []
                [ Table.td [] [ text "0" ]
                , Table.td [] [ text "Carmine" ]
                , Table.td [ Table.numeric ] [ text "74" ]
                , Table.td [] [ text "True" ]
                ]
            , Table.tr []
                [ Table.td [] [ text "1" ]
                , Table.td [] [ text "Francesco" ]
                , Table.td [ Table.numeric ] [ text "77" ]
                , Table.td [] [ text "True" ]
                ]
            , Table.tr []
                [ Table.td [] [ text "2" ]
                , Table.td [] [ text "Anna" ]
                , Table.td [ Table.numeric ] [ text "80" ]
                , Table.td [] [ text "True" ]
                ]
            , Table.tr []
                [ Table.td [] [ text "3" ]
                , Table.td [] [ text "Enrico" ]
                , Table.td [ Table.numeric ] [ text "09" ]
                , Table.td [] [ text "True" ]
                ]
            , Table.tr []
                [ Table.td [] [ text "4" ]
                , Table.td [] [ text "Assunta" ]
                , Table.td [ Table.numeric ] [ text "17" ]
                , Table.td [] [ text "False" ]
                ]
            ]
        , Table.tfoot []
            [ Table.tr []
                [ Table.td [ Options.attribute <| attribute "colspan" "4" ] [ text "pagination goes here" ]
                ]
            ]
        ]


subscriptions : Model -> Sub Msg
subscriptions model =
    Layout.subs Mdl model.mdl
