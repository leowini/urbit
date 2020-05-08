module Urbit.Urlicht.Demo where

import ClassyPrelude

import Control.Arrow ((>>>))

import Urbit.Urlicht.CST as CST
--import Urbit.Urlicht.Hoon as H
import Urbit.Urlicht.Parser
import Urbit.Urlicht.RunicShow
import qualified Urbit.Urlicht.Core as C
import Urbit.Urlicht.Elab
import Urbit.Urlicht.Elaborate
import Urbit.Urlicht.Env
import qualified Urbit.Urlicht.HoonToSimple as H2S
--import qualified Urbit.Urlicht.Simple as S
import qualified Urbit.Urlicht.SimpleToCoreHack as S2C
import Urbit.Urlicht.Unify

udemo :: Text -> IO ()
udemo prog = runElabIO do
  s <- H2S.down . CST.abstractify <$> parse prog
  putStrLn ("SIMPLE:\n" <> runic s)
  (t, c) <- infer emptyEnv s
  t <- crank t
  c <- zonk c
  putStrLn ("ELABORATED:\n" <> runic c)
  putStrLn ("TYPE:\n" <> runic t)
  tell

dunify :: Text -> Text -> IO ()
dunify p1 p2 = runElabIO do
  v1 <- C.eval . S2C.down . H2S.down . CST.abstractify <$> parse p1
  v2 <- C.eval . S2C.down . H2S.down . CST.abstractify <$> parse p2
  unify v1 v2
  tell

parse :: Text -> ElabT IO CST
parse = parseCst >>> \case
  Left err -> terror ("parser: " <> err)
  Right c -> pure c
